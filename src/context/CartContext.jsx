import React, { createContext, useReducer, useContext } from 'react';

export const CartContext = createContext(null);

const initialState = {
  items: [],
  isDrawerOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + (action.payload.qty || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product, qty = 1) =>
    dispatch({ type: 'ADD', payload: { ...product, qty } });

  const removeFromCart = (id) => dispatch({ type: 'REMOVE', payload: id });

  const updateQty = (id, qty) => {
    if (qty < 1) return dispatch({ type: 'REMOVE', payload: id });
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const toggleDrawer = () => dispatch({ type: 'TOGGLE_DRAWER' });
  const openDrawer = () => dispatch({ type: 'OPEN_DRAWER' });
  const closeDrawer = () => dispatch({ type: 'CLOSE_DRAWER' });

  const cartCount = state.items.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = state.items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isDrawerOpen: state.isDrawerOpen,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleDrawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
