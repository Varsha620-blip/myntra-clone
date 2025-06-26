import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';

// Storage interface for cross-platform support
interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  deleteItem(key: string): Promise<void>;
}

// Web storage implementation
const webStorage: Storage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => localStorage.setItem(key, value),
  deleteItem: async (key: string) => localStorage.removeItem(key),
};

// Native storage implementation
let nativeStorage: Storage | null = null;
if (Platform.OS !== 'web') {
  const SecureStore = require('expo-secure-store');
  nativeStorage = {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    deleteItem: SecureStore.deleteItemAsync,
  };
}

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 
  (Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://192.168.56.1:5000/api');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const storage = Platform.OS === 'web' ? webStorage : nativeStorage!;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await storage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await res.json();

      if (data.status === 'success') {
        setUser(data.data.user);
      } else {
        await storage.deleteItem('auth_token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading stored auth:', err);
      try {
        await storage.deleteItem('auth_token');
      } catch (deleteError) {
        console.error('Error deleting token:', deleteError);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Input validation
      if (!email || !password) {
        Alert.alert('Error', 'Please provide both email and password');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          password: password.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // More specific error handling
        if (response.status === 401) {
          Alert.alert(
            'Login Failed',
            data.message || 'Invalid email or password'
          );
        } else {
          Alert.alert('Error', data.message || 'Login failed');
        }
        return false;
      }

      if (data.status === 'success') {
        await storage.setItem('auth_token', data.data.token);
        setUser(data.data.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert(
        'Network Error', 
        'Could not connect to the server. Please check your internet connection.'
      );
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      // Input validation
      if (!data.email || !data.password || !data.name) {
        Alert.alert('Error', 'Please fill all required fields');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          email: data.email.trim().toLowerCase(),
          password: data.password.trim()
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Signup Failed',
          responseData.message || 'Could not create account'
        );
        return false;
      }

      if (responseData.status === 'success') {
        await storage.setItem('auth_token', responseData.data.token);
        setUser(responseData.data.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Network Error', 'Please check your connection.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = await storage.getItem('auth_token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      try {
        await storage.deleteItem('auth_token');
      } catch (deleteError) {
        console.error('Error deleting token:', deleteError);
      }
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};