import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Product } from '@/types';

// Use your actual backend URL
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api' 
  : 'http://192.168.56.1:5000/api'; // Replace with your actual IP

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const getAuthHeaders = async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const transformProduct = (backendProduct: any): Product => ({
    id: backendProduct._id,
    name: backendProduct.name,
    brand: backendProduct.brand,
    price: backendProduct.price,
    originalPrice: backendProduct.originalPrice,
    discount: backendProduct.discount,
    rating: backendProduct.rating?.average || 0,
    reviewCount: backendProduct.rating?.count || 0,
    image: backendProduct.images?.[0]?.url || backendProduct.images?.[0] || '',
    images: backendProduct.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
    category: backendProduct.category,
    description: backendProduct.description || '',
    sizes: backendProduct.sizes || [],
    colors: backendProduct.colors?.map((color: any) => typeof color === 'string' ? color : color.name) || [],
    inStock: backendProduct.inStock !== false,
    isNew: backendProduct.isNew,
    isBestseller: backendProduct.isBestseller,
  });

  const loadRecentlyViewed = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/users/recently-viewed?limit=20`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const products = data.data.recentlyViewed
            .filter((item: any) => item.product)
            .map((item: any) => transformProduct(item.product));
          setRecentlyViewed(products);
        }
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = async (product: Product) => {
    try {
      const headers = await getAuthHeaders();
      
      await fetch(`${API_BASE_URL}/products/${product.id}/view`, {
        method: 'POST',
        headers,
      });

      // Update local state optimistically
      setRecentlyViewed(prev => {
        const filtered = prev.filter(item => item.id !== product.id);
        return [product, ...filtered].slice(0, 20);
      });
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/users/recently-viewed`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        setRecentlyViewed([]);
      }
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  return {
    recentlyViewed,
    loading,
    addToRecentlyViewed,
    clearRecentlyViewed,
    refreshRecentlyViewed: loadRecentlyViewed,
  };
}