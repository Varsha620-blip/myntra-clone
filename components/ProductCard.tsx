import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Star } from 'lucide-react-native';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  width?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function ProductCard({ product, width }: ProductCardProps) {
  const router = useRouter();
  const cardWidth = width || (screenWidth - 48) / 2;

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        )}
        <TouchableOpacity style={styles.heartButton}>
          <Heart size={20} color="#666" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FF9800" fill="#FF9800" />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E91E63',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 6,
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter-SemiBold',
    lineHeight: 18,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});