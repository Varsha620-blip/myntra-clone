import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter, ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { Product } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    // Load featured products (bestsellers)
    const featured = products.filter(product => product.isBestseller).slice(0, 8);
    setFeaturedProducts(featured);

    // Load trending products (high rating)
    const trending = products.filter(product => product.rating >= 4.3).slice(0, 6);
    setTrendingProducts(trending);

    // Load new arrivals
    const newItems = products.filter(product => product.isNew).slice(0, 6);
    setNewArrivals(newItems);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => router.push(`/categories/${item.id}`)}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} items</Text>
    </TouchableOpacity>
  );

  const renderBrandCard = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.brandCard}>
      <Text style={styles.brandName}>{item}</Text>
    </TouchableOpacity>
  );

  const displayProducts = searchQuery.trim() ? searchResults : featuredProducts;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.logo}>Myntra</Text>
              <Text style={styles.subtitle}>FASHION & LIFESTYLE</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <ShoppingBag size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>FLAT 50-80% OFF</Text>
            <Text style={styles.bannerSubtitle}>+ Extra 10% Off</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>SHOP NOW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Deal of the Day */}
        <View style={styles.dealSection}>
          <View style={styles.dealHeader}>
            <Text style={styles.dealTitle}>DEAL OF THE DAY</Text>
            <View style={styles.dealTimer}>
              <Text style={styles.dealTimerText}>22h 59m Left</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dealProductsContainer}>
              {featuredProducts.slice(0, 4).map((product) => (
                <View key={product.id} style={styles.dealProductCard}>
                  <Image source={{ uri: product.image }} style={styles.dealProductImage} />
                  <View style={styles.dealProductInfo}>
                    <Text style={styles.dealProductBrand}>{product.brand}</Text>
                    <Text style={styles.dealProductName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.dealProductPricing}>
                      <Text style={styles.dealProductPrice}>₹{product.price}</Text>
                      <Text style={styles.dealProductOriginalPrice}>₹{product.originalPrice}</Text>
                      <Text style={styles.dealProductDiscount}>({product.discount}% OFF)</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Products / Search Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() ? `SEARCH RESULTS (${searchResults.length})` : 'TRENDING NOW'}
          </Text>
          {displayProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  width={(screenWidth - 48) / 2}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery.trim() ? 'No products found' : 'No trending products available'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery.trim() ? 'Try a different search term' : 'Check back later for new arrivals'}
              </Text>
            </View>
          )}
        </View>

        {/* New Arrivals */}
        {!searchQuery.trim() && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NEW ARRIVALS</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.horizontalProductsContainer}>
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    width={160}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Brands */}
        {!searchQuery.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRENDING BRANDS</Text>
            <FlatList
              data={['ZARA', 'H&M', 'Nike', 'Adidas', 'Levis', 'Puma']}
              renderItem={renderBrandCard}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.brandsList}
            />
          </View>
        )}

        {/* Bottom Banner */}
        {!searchQuery.trim() && (
          <View style={styles.bottomBannerContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg' }}
              style={styles.bottomBannerImage}
            />
            <View style={styles.bottomBannerOverlay}>
              <Text style={styles.bottomBannerTitle}>MYNTRA INSIDER</Text>
              <Text style={styles.bottomBannerSubtitle}>Become an Insider & get exciting perks</Text>
              <TouchableOpacity style={styles.bottomBannerButton}>
                <Text style={styles.bottomBannerButtonText}>JOIN NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bannerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
    letterSpacing: 0.5,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 90,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  dealSection: {
    backgroundColor: '#fff3e0',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dealTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
    letterSpacing: 0.5,
  },
  dealTimer: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  dealTimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  dealProductsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dealProductCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 140,
    overflow: 'hidden',
  },
  dealProductImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  dealProductInfo: {
    padding: 8,
  },
  dealProductBrand: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 2,
  },
  dealProductName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginBottom: 4,
  },
  dealProductPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dealProductPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginRight: 4,
  },
  dealProductOriginalPrice: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  dealProductDiscount: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  horizontalProductsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  brandsList: {
    paddingHorizontal: 16,
  },
  brandCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  brandName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  bottomBannerContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bottomBannerImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  bottomBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(233, 30, 99, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBannerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  bottomBannerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  bottomBannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bottomBannerButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
  },
});