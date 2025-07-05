import { useState, useEffect } from 'react';
import { Product, FilterOptions } from '@/types';
import { products } from '@/data/products';

export function useFilters() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 50000 },
    rating: 0,
    brands: []
  });
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortBy, searchQuery]);

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setFilteredProducts(filtered);
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const updateSort = (newSort: string) => {
    setSortBy(newSort);
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 50000 },
      rating: 0,
      brands: []
    });
    setSearchQuery('');
    setSortBy('popularity');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  return {
    filteredProducts,
    filters,
    sortBy,
    searchQuery,
    updateFilters,
    updateSort,
    updateSearch,
    clearFilters,
    getActiveFiltersCount,
  };
}