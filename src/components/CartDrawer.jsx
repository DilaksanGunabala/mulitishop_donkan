import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQty, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">Your cart is empty</p>
              <button
                onClick={closeDrawer}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                  <p className="text-blue-600 text-sm font-semibold">
                    Rs.{Number(item.price).toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t space-y-3">
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>Rs.{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <Link
              to="/cart"
              onClick={closeDrawer}
              className="block text-center w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              View Cart &amp; Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
