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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter, ArrowRight } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/hooks/userAuth';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

// Static categories for UI
const staticCategories = [
  { id: 'men', name: 'Men', icon: '👔' },
  { id: 'women', name: 'Women', icon: '👗' },
  { id: 'kids', name: 'Kids', icon: '🧸' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'accessories', name: 'Accessories', icon: '👜' }
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();
  const { featuredProducts, fetchFeaturedProducts, searchProducts } = useProducts();

  useEffect(() => {
    // Don't redirect immediately, wait for auth to load
    if (!authLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    await fetchFeaturedProducts();
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchProducts(searchQuery.trim());
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
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecentlyViewedItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} width={160} />
  );

  // Show loading screen while auth is loading
  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
          <Text style={styles.logo}>Myntra</Text>
          <Text style={styles.subtitle}>Fashion & Lifestyle</Text>
          {user && (
            <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products, brands..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <ArrowRight size={20} color="#E91E63" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={staticCategories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <FlatList
              data={recentlyViewed}
              renderItem={renderRecentlyViewedItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentlyViewedList}
            />
          </View>
        )}

        {/* Featured Products / Search Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() ? `Search Results (${searchResults.length})` : 'Featured Products'}
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
                {searchQuery.trim() ? 'No products found' : 'No featured products available'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery.trim() ? 'Try a different search term' : 'Check back later for new arrivals'}
              </Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E91E63',
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  filterButton: {
    padding: 4,
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  recentlyViewedList: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
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
});