import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { CartItem, Product } from '@/types';

// Mock cart data for demo
const mockCartItems: CartItem[] = [
  {
    product: {
      id: '1',
      name: 'Cotton Casual Shirt',
      brand: 'ZARA',
      price: 1299,
      originalPrice: 1899,
      discount: 32,
      rating: 4.2,
      reviewCount: 1204,
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
      category: 'Men',
      description: 'A comfortable cotton casual shirt perfect for everyday wear.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Blue', 'Black'],
      inStock: true,
      isNew: true
    },
    quantity: 2,
    size: 'M',
    color: 'Blue'
  },
  {
    product: {
      id: '2',
      name: 'Floral Summer Dress',
      brand: 'H&M',
      price: 2199,
      originalPrice: 2999,
      discount: 27,
      rating: 4.5,
      reviewCount: 856,
      image: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
      images: ['https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg'],
      category: 'Women',
      description: 'Beautiful floral print summer dress with flowing silhouette.',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Floral Print', 'Solid Blue'],
      inStock: true,
      isBestseller: true
    },
    quantity: 1,
    size: 'S',
    color: 'Floral Print'
  }
];

const mockSavedItems: CartItem[] = [
  {
    product: {
      id: '3',
      name: 'Sports Sneakers',
      brand: 'Nike',
      price: 3499,
      originalPrice: 4999,
      discount: 30,
      rating: 4.4,
      reviewCount: 1890,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
      category: 'Sports',
      description: 'High-performance sports sneakers for running and training.',
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['White', 'Black', 'Red'],
      inStock: true,
      isNew: true
    },
    quantity: 1,
    size: '9',
    color: 'White'
  }
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [savedItems, setSavedItems] = useState<CartItem[]>(mockSavedItems);

  const updateQuantity = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.size === size && item.color === color)
    ));
  };

  const saveForLater = (productId: string, size: string, color: string) => {
    const item = cartItems.find(item => 
      item.product.id === productId && item.size === size && item.color === color
    );
    
    if (item) {
      setSavedItems(prev => [...prev, item]);
      removeFromCart(productId, size, color);
    }
  };

  const moveToCart = (productId: string, size: string, color: string) => {
    const item = savedItems.find(item => 
      item.product.id === productId && item.size === size && item.color === color
    );
    
    if (item) {
      setCartItems(prev => [...prev, item]);
      removeSavedItem(productId, size, color);
    }
  };

  const removeSavedItem = (productId: string, size: string, color: string) => {
    setSavedItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.size === size && item.color === color)
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add some items to your cart before checkout.');
      return;
    }
    Alert.alert('Checkout', 'Proceeding to payment gateway...');
  };

  const renderCartItem = (item: CartItem) => (
    <View key={`${item.product.id}-${item.size}-${item.color}`} style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemVariant}>Size: {item.size} | Color: {item.color}</Text>
        
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>₹{item.product.price.toLocaleString()}</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
            >
              <Minus size={16} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
            >
              <Plus size={16} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => saveForLater(item.product.id, item.size, item.color)}
          >
            <Text style={styles.actionText}>Save for Later</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeFromCart(item.product.id, item.size, item.color)}
          >
            <Trash2 size={16} color="#E91E63" />
            <Text style={[styles.actionText, { color: '#E91E63' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSavedItem = (item: CartItem) => (
    <View key={`saved-${item.product.id}-${item.size}-${item.color}`} style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemVariant}>Size: {item.size} | Color: {item.color}</Text>
        <Text style={styles.itemPrice}>₹{item.product.price.toLocaleString()}</Text>
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => moveToCart(item.product.id, item.size, item.color)}
          >
            <Text style={styles.actionText}>Move to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeSavedItem(item.product.id, item.size, item.color)}
          >
            <Trash2 size={16} color="#E91E63" />
            <Text style={[styles.actionText, { color: '#E91E63' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        {cartItems.length > 0 && (
          <Text style={styles.itemCount}>{getTotalItems()} items</Text>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cart Items ({cartItems.length})</Text>
            {cartItems.map(renderCartItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ShoppingBag size={64} color="#ccc" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>Add some items to get started</Text>
          </View>
        )}

        {/* Saved for Later */}
        {savedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved for Later ({savedItems.length})</Text>
            {savedItems.map(renderSavedItem)}
          </View>
        )}
      </ScrollView>

      {/* Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.checkout}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{getTotalPrice().toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginVertical: 2,
  },
  itemVariant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginHorizontal: 12,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  checkout: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
  },
  checkoutButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginRight: 8,
  },
});