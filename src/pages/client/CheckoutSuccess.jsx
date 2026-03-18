import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Placed — New Multi Shop</title>
      </Helmet>

      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
        <div className="bg-green-50 rounded-full p-5">
          <FiCheckCircle size={56} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Order Placed!</h1>
        <p className="text-gray-500 max-w-md">
          Thank you for your order. We'll get back to you via WhatsApp to confirm your order details.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/products"
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}
