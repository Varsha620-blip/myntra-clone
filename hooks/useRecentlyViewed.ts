import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Product } from '@/types';

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

interface RecentlyViewedItem {
  product: Product;
  viewedAt: string;
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    try {
      setLoading(true);
      const data = await getStorageValue('recently_viewed');
      if (data) {
        const parsed = JSON.parse(data);
        setRecentlyViewed(parsed);
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = async (product: Product) => {
    try {
      // Remove if already exists
      const filtered = recentlyViewed.filter(item => item.product.id !== product.id);
      
      // Add to beginning
      const newItem: RecentlyViewedItem = {
        product,
        viewedAt: new Date().toISOString()
      };
      
      const newRecentlyViewed = [newItem, ...filtered].slice(0, 20); // Keep only last 20 items
      
      setRecentlyViewed(newRecentlyViewed);
      await setStorageValue('recently_viewed', JSON.stringify(newRecentlyViewed));
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      setRecentlyViewed([]);
      await setStorageValue('recently_viewed', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  const getRecentlyViewedProducts = () => {
    return recentlyViewed.map(item => item.product);
  };

  return {
    recentlyViewed: getRecentlyViewedProducts(),
    loading,
    addToRecentlyViewed,
    clearRecentlyViewed,
    refreshRecentlyViewed: loadRecentlyViewed,
  };
}