import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartSummary, Product } from '../types';
import * as api from '../services/api';

interface CartContextType {
  cart: CartSummary;
  itemCount: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const DEFAULT_CART: CartSummary = {
  items: [],
  total_items: 0,
  subtotal: 0,
  estimated_shipping: 0,
  estimated_tax: 0,
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartSummary>(DEFAULT_CART);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.warn('Failed to load cart from server, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      await api.addToCart(product.id, quantity);
      await refreshCart();
    } catch (err: any) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.updateCartItem(itemId, quantity);
      await refreshCart();
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.removeCartItem(itemId);
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart.total_items,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
