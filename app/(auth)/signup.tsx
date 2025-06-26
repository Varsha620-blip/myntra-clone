import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react-native';
import { useAuth } from '@/hooks/userAuth';

export default function SignupScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signup } = useAuth();

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
        errorMessage = (error as any).message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to start shopping</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            autoCapitalize="words"
            autoComplete="name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(v) => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone (Optional)"
            value={form.phone}
            onChangeText={(v) => handleChange('phone', v)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={form.password}
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color="#666" />
            ) : (
              <Eye size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color="#666" />
            ) : (
              <Eye size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signupButton, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  signupButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
});