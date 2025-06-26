import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Filter, ArrowUpDown } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { FilterModal } from '@/components/FilterModal';
import { SortModal } from '@/components/SortModal';
import { useProducts } from '@/hooks/useProducts';
import { FilterOptions, Product } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

export default function CategoriesScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 50000 },
    rating: 0,
    brands: []
  });

  const router = useRouter();
  const { products, loading, fetchProducts, fetchBrands, brands } = useProducts();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, selectedSort]);

  const loadData = async () => {
    await fetchBrands();
    await applyFiltersAndSort();
  };

  const applyFiltersAndSort = async () => {
    await fetchProducts(filters, selectedSort);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getSortLabel = () => {
    switch (selectedSort) {
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'rating': return 'Customer Rating';
      case 'newest': return 'Newest First';
      default: return 'Popularity';
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Products</Text>
        <Text style={styles.resultCount}>{products.length} items</Text>
      </View>

      {/* Filter and Sort Bar */}
      <View style={styles.filterSortBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={18} color="#333" />
          <Text style={styles.filterText}>
            Filter {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <ArrowUpDown size={18} color="#333" />
          <Text style={styles.sortText}>{getSortLabel()}</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && products.length === 0 ? (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : products.length > 0 ? (
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={(screenWidth - 48) / 2}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or check back later</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
        availableBrands={brands}
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />
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
  resultCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  filterSortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
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