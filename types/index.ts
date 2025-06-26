export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  brands: string[];
}

export interface SortOption {
  label: string;
  value: 'popularity' | 'price-low' | 'price-high' | 'newest' | 'rating';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}