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
import { db } from '../firebase';
import { slugify } from '../utils/slugify';
import { uploadImageToCloudinary } from '../utils/cloudinary';

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

// Upload all files to Cloudinary in parallel and return their URLs
export async function uploadImages(files) {
  return Promise.all(files.map((file) => uploadImageToCloudinary(file)));
}

export async function addProduct(data, imageFiles) {
  const slug = slugify(data.name);
  const docRef = doc(collection(db, COLLECTION));

  // Upload images to Cloudinary in parallel, then save URLs to Firestore
  const images =
    imageFiles && imageFiles.length > 0
      ? await uploadImages(imageFiles)
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

  // Remove deleted image URLs from Firestore record
  // (Cloudinary deletion requires a server-side API secret — URLs are simply dropped)
  images = images.filter((img) => !removedImageUrls.includes(img));

  // Upload new images to Cloudinary in parallel
  if (newImageFiles && newImageFiles.length > 0) {
    const newUrls = await uploadImages(newImageFiles);
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
