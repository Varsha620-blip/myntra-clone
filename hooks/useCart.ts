import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { CartItem, Product } from '@/types';

// Platform-specific storage
const getStorageValue = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    try {
      const SecureStore = await import('expo-secure-store');
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  }
};

const setStorageValue = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    try {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback to memory storage
    }
  }
};

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const cartData = await getStorageValue('cart_items');
      const savedData = await getStorageValue('saved_items');
      
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
      if (savedData) {
        setSavedItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartData = async (cart: CartItem[], saved: CartItem[]) => {
    try {
      await setStorageValue('cart_items', JSON.stringify(cart));
      await setStorageValue('saved_items', JSON.stringify(saved));
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  };

  const addToCart = async (product: Product, size: string, color: string, quantity: number = 1) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        item => item.product.id === product.id && 
                 item.size === size && 
                 item.color === color
      );

      let newCartItems;
      if (existingItemIndex >= 0) {
        newCartItems = [...cartItems];
        newCartItems[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          product,
          quantity,
          size,
          color
        };
        newCartItems = [...cartItems, newItem];
      }

      setCartItems(newCartItems);
      await saveCartData(newCartItems, savedItems);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
      return false;
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    try {
      const newCartItems = cartItems.filter(item => 
        !(item.product.id === productId && item.size === size && item.color === color)
      );
      
      setCartItems(newCartItems);
      await saveCartData(newCartItems, savedItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId, size, color);
        return;
      }

      const newCartItems = cartItems.map(item => 
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      );
      
      setCartItems(newCartItems);
      await saveCartData(newCartItems, savedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const saveForLater = async (productId: string, size: string, color: string) => {
    try {
      const itemIndex = cartItems.findIndex(item => 
        item.product.id === productId && item.size === size && item.color === color
      );
      
      if (itemIndex >= 0) {
        const item = cartItems[itemIndex];
        const newCartItems = cartItems.filter((_, index) => index !== itemIndex);
        const newSavedItems = [...savedItems, item];
        
        setCartItems(newCartItems);
        setSavedItems(newSavedItems);
        await saveCartData(newCartItems, newSavedItems);
      }
    } catch (error) {
      console.error('Error saving for later:', error);
      Alert.alert('Error', 'Failed to save item');
    }
  };

  const moveToCart = async (productId: string, size: string, color: string) => {
    try {
      const itemIndex = savedItems.findIndex(item => 
        item.product.id === productId && item.size === size && item.color === color
      );
      
      if (itemIndex >= 0) {
        const item = savedItems[itemIndex];
        const newSavedItems = savedItems.filter((_, index) => index !== itemIndex);
        const newCartItems = [...cartItems, item];
        
        setCartItems(newCartItems);
        setSavedItems(newSavedItems);
        await saveCartData(newCartItems, newSavedItems);
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      Alert.alert('Error', 'Failed to move item');
    }
  };

  const removeSavedItem = async (productId: string, size: string, color: string) => {
    try {
      const newSavedItems = savedItems.filter(item => 
        !(item.product.id === productId && item.size === size && item.color === color)
      );
      
      setSavedItems(newSavedItems);
      await saveCartData(cartItems, newSavedItems);
    } catch (error) {
      console.error('Error removing saved item:', error);
      Alert.alert('Error', 'Failed to remove saved item');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await saveCartData([], savedItems);
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
    }
  };

  return {
    cartItems,
    savedItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
    getTotalPrice,
    getTotalItems,
    clearCart,
    refreshCart: loadCartData,
  };
}