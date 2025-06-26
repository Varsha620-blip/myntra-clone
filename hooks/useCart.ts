import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';
import { CartItem, Product } from '@/types';

// Use your actual backend URL
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api' 
  : 'http://192.168.1.100:5000/api'; // Replace with your actual IP

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartData();
  }, []);

  const getAuthHeaders = async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const loadCartData = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Transform backend data to match frontend interface
          const transformedCart = data.data.cart.map((item: any) => ({
            product: {
              id: item.product._id,
              name: item.product.name,
              brand: item.product.brand,
              price: item.product.price,
              originalPrice: item.product.originalPrice,
              discount: item.product.discount,
              rating: item.product.rating?.average || 0,
              reviewCount: item.product.rating?.count || 0,
              image: item.product.images?.[0]?.url || item.product.images?.[0] || '',
              images: item.product.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
              category: item.product.category,
              description: item.product.description || '',
              sizes: item.product.sizes || [],
              colors: item.product.colors?.map((color: any) => typeof color === 'string' ? color : color.name) || [],
              inStock: item.product.inStock,
              isNew: item.product.isNew,
              isBestseller: item.product.isBestseller,
            },
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }));

          const transformedSaved = data.data.savedForLater.map((item: any) => ({
            product: {
              id: item.product._id,
              name: item.product.name,
              brand: item.product.brand,
              price: item.product.price,
              originalPrice: item.product.originalPrice,
              discount: item.product.discount,
              rating: item.product.rating?.average || 0,
              reviewCount: item.product.rating?.count || 0,
              image: item.product.images?.[0]?.url || item.product.images?.[0] || '',
              images: item.product.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
              category: item.product.category,
              description: item.product.description || '',
              sizes: item.product.sizes || [],
              colors: item.product.colors?.map((color: any) => typeof color === 'string' ? color : color.name) || [],
              inStock: item.product.inStock,
              isNew: item.product.isNew,
              isBestseller: item.product.isBestseller,
            },
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }));

          setCartItems(transformedCart);
          setSavedItems(transformedSaved);
        }
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, size: string, color: string, quantity: number = 1) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: product.id,
          size,
          color,
          quantity,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        await loadCartData(); // Refresh cart data
        return true;
      } else {
        Alert.alert('Error', data.message || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Network error. Please try again.');
      return false;
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          productId,
          size,
          color,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        await loadCartData();
      } else {
        Alert.alert('Error', data.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          productId,
          size,
          color,
          quantity,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        await loadCartData();
      } else {
        Alert.alert('Error', data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const saveForLater = async (productId: string, size: string, color: string) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/save-for-later`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId,
          size,
          color,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        await loadCartData();
      } else {
        Alert.alert('Error', data.message || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving for later:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const moveToCart = async (productId: string, size: string, color: string) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/move-to-cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId,
          size,
          color,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        await loadCartData();
      } else {
        Alert.alert('Error', data.message || 'Failed to move item');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const removeSavedItem = async (productId: string, size: string, color: string) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/remove-saved`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          productId,
          size,
          color,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        await loadCartData();
      } else {
        Alert.alert('Error', data.message || 'Failed to remove saved item');
      }
    } catch (error) {
      console.error('Error removing saved item:', error);
      Alert.alert('Error', 'Network error. Please try again.');
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
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setCartItems([]);
      } else {
        Alert.alert('Error', data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Network error. Please try again.');
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