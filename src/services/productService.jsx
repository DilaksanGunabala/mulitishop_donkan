import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { slugify } from '../utils/slugify';

const COLLECTION = 'products';

// Cache — admin navigation reuses data; client pages always fetch fresh
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 30_000; // 30 seconds (admin panel only)

function isCacheValid() {
  return _cache && Date.now() - _cacheTime < CACHE_TTL;
}

function setCache(data) {
  _cache = data;
  _cacheTime = Date.now();
}

export function invalidateCache() {
  _cache = null;
}

async function fetchFromFirestore() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? 0;
      const tb = b.createdAt?.toMillis?.() ?? 0;
      return tb - ta;
    });
}

// Used by admin panel — uses cache to speed up navigation
export async function getProducts() {
  if (isCacheValid()) return _cache;
  const data = await fetchFromFirestore();
  setCache(data);
  return data;
}

// Used by client/viewer pages — always fetches fresh so new products appear immediately
export async function getProductsLive() {
  const data = await fetchFromFirestore();
  setCache(data); // update cache as a side-effect
  return data;
}

// Get featured products — filter client-side from cache (avoids compound index)
export async function getFeaturedProducts(count = 8) {
  const all = await getProducts();
  return all.filter((p) => p.featured).slice(0, count);
}

export async function getProductBySlug(slug) {
  // Try cache first
  if (isCacheValid()) {
    const found = _cache.find((p) => p.slug === slug);
    if (found) return found;
  }
  const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getProductById(id) {
  // Try cache first
  if (isCacheValid()) {
    const found = _cache.find((p) => p.id === id);
    if (found) return found;
  }
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Skip compression for small files; compress large ones to max 900px / 75% JPEG
function compressImage(file, maxPx = 900, quality = 0.75) {
  // Already small enough — upload as-is
  if (file.size < 300 * 1024) return Promise.resolve(file);

  return new Promise((resolve) => {
    // Safety timeout — if canvas.toBlob never fires, fall back to original file
    const timeout = setTimeout(() => resolve(file), 8000);
    const done = (result) => { clearTimeout(timeout); resolve(result); };

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round((height * maxPx) / width); width = maxPx; }
        else { width = Math.round((width * maxPx) / height); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => done(blob || file), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); done(file); };
    img.src = url;
  });
}

export async function uploadImages(files, productId) {
  const uploads = files.map(async (file) => {
    const compressed = await compressImage(file);
    const name = `${Date.now()}_${file.name.replace(/\.[^.]+$/, '.jpg')}`;
    const storageRef = ref(storage, `products/${productId}/${name}`);
    await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
    return getDownloadURL(storageRef);
  });
  return Promise.all(uploads);
}

export async function addProduct(data, imageFiles) {
  const slug = slugify(data.name);
  // Pre-generate the doc ID so we can upload images and write in ONE Firestore call
  const docRef = doc(collection(db, COLLECTION));

  // Upload images first (parallel), then single write
  const images =
    imageFiles && imageFiles.length > 0
      ? await uploadImages(imageFiles, docRef.id)
      : [];

  await setDoc(docRef, {
    ...data,
    slug,
    images,
    createdAt: serverTimestamp(),
  });

  invalidateCache();
  return { id: docRef.id, ...data, slug, images };
}

export async function updateProduct(id, data, newImageFiles, removedImageUrls = []) {
  const docRef = doc(db, COLLECTION, id);
  let images = data.images || [];

  // Delete removed images
  await Promise.allSettled(
    removedImageUrls.map((url) => deleteObject(ref(storage, url)))
  );
  images = images.filter((img) => !removedImageUrls.includes(img));

  // Upload new images in parallel
  if (newImageFiles && newImageFiles.length > 0) {
    const newUrls = await uploadImages(newImageFiles, id);
    images = [...images, ...newUrls];
  }

  const slug = slugify(data.name);
  await updateDoc(docRef, { ...data, slug, images, updatedAt: serverTimestamp() });

  invalidateCache();
  return { id, ...data, slug, images };
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id));
  invalidateCache();
}
