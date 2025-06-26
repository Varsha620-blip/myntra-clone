import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, ShoppingBag, Heart, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/userAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: ShoppingBag,
      title: 'My Orders',
      subtitle: 'View your order history',
      onPress: () => Alert.alert('Orders', 'Orders feature coming soon!'),
    },
    {
      icon: Heart,
      title: 'Wishlist',
      subtitle: 'Your saved items',
      onPress: () => Alert.alert('Wishlist', 'Wishlist feature coming soon!'),
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'Account and app settings',
      onPress: () => Alert.alert('Settings', 'Settings feature coming soon!'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      onPress: () => Alert.alert('Support', 'Support feature coming soon!'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <item.icon size={20} color="#E91E63" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#E91E63" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Myntra Clone v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ using React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  menu: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
});