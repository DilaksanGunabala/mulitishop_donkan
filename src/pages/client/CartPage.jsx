import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '94762606990';

export default function CartPage() {
  const { items, cartTotal, updateQty, removeFromCart, clearCart } = useCart();

  const buildWhatsAppMessage = () => {
    if (items.length === 0) return '';
    const lines = items.map(
      (item) =>
        `• ${item.name} x${item.qty} = Rs.${(item.price * item.qty).toLocaleString('en-IN')}`
    );
    lines.push(`\n*Total: Rs.${cartTotal.toLocaleString('en-IN')}*`);
    return encodeURIComponent(`Hi! I'd like to order:\n\n${lines.join('\n')}`);
  };

  return (
    <>
      <Helmet>
        <title>Cart — New Multi Shop</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <FiShoppingBag size={56} className="mx-auto text-gray-300" />
            <p className="text-xl text-gray-400">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart table */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-blue-600 font-bold">Rs.{Number(item.price).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-700 w-24 text-right">
                    Rs.{(item.price * item.qty).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline"
              >
                Clear cart
              </button>
            </div>

            {/* Order summary */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="truncate mr-2">{item.name} x{item.qty}</span>
                       <span className="flex-shrink-0">Rs.{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span>Rs.{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp size={20} />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
