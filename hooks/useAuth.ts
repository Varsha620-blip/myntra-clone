import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // for secure token storage
import { Alert } from 'react-native';
import { useAuth, AuthProvider } from '@/hooks/userAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Use your IP instead of localhost on physical device
  });

  useEffect(() => {
    const loadProfile = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        try {
          const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.data.user);
        } catch (e) {
          await SecureStore.deleteItemAsync('token');
        }
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('token', res.data.data.token);
      setUser(res.data.data.user);
    } catch (err: any) {
      Alert.alert('Login failed', err?.response?.data?.message || 'Error');
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.post('/auth/register', data);
      Alert.alert('Success', 'Account created! Please login.');
    } catch (err: any) {
      Alert.alert('Registration failed', err?.response?.data?.message || 'Error');
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
