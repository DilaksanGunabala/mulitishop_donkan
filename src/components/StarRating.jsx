import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function StarRating({ productId }) {
  const { user } = useAuth();
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const ratingsRef = collection(db, 'products', productId, 'ratings');

  useEffect(() => {
    let cancelled = false;

    async function fetchRatings() {
      const snapshot = await getDocs(ratingsRef);
      const ratings = snapshot.docs.map((d) => d.data().value);
      if (!cancelled) {
        if (ratings.length > 0) {
          setAvgRating(ratings.reduce((a, b) => a + b, 0) / ratings.length);
          setCount(ratings.length);
        }
      }
    }

    async function fetchUserRating() {
      if (!user) return;
      const docRef = doc(ratingsRef, user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists() && !cancelled) {
        setUserRating(snap.data().value);
      }
    }

    fetchRatings();
    fetchUserRating();
    return () => { cancelled = true; };
  }, [productId, user]);

  const handleRate = async (value) => {
    if (!user) {
      toast.info('Please sign in to rate this product');
      return;
    }
    try {
      await setDoc(doc(ratingsRef, user.uid), { value, uid: user.uid });
      setUserRating(value);
      toast.success('Rating submitted!');
      // Refresh average
      const snapshot = await getDocs(ratingsRef);
      const ratings = snapshot.docs.map((d) => d.data().value);
      if (ratings.length > 0) {
        setAvgRating(ratings.reduce((a, b) => a + b, 0) / ratings.length);
        setCount(ratings.length);
      }
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
            className="focus:outline-none"
          >
            <FaStar
              size={22}
              className={`transition-colors ${
                star <= (hovered || userRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        {count > 0
          ? `${avgRating.toFixed(1)} / 5 (${count} rating${count !== 1 ? 's' : ''})`
          : 'No ratings yet'}
      </p>
      {!user && (
        <p className="text-xs text-gray-400">Sign in to rate this product</p>
      )}
    </div>
  );
}
