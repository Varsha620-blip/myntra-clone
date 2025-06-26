import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { SortOption } from '@/types';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const sortOptions: SortOption[] = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Customer Rating', value: 'rating' },
];

export function SortModal({ visible, onClose, selectedSort, onSelectSort }: SortModalProps) {
  const handleSelect = (value: string) => {
    onSelectSort(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort By</Text>
          </View>
          
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              {selectedSort === option.value && (
                <Check size={20} color="#E91E63" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 32,
    minWidth: 280,
    maxWidth: 320,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
});