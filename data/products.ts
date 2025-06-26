import { Product } from '@/types';


export const products: Product[] = [
  {
    id: '1',
    name: 'Cotton Casual Shirt',
    brand: 'ZARA',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.2,
    reviewCount: 1204,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    category: 'Men',
    description: 'A comfortable cotton casual shirt perfect for everyday wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    inStock: true,
    isNew: true
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    brand: 'H&M',
    price: 2199,
    originalPrice: 2999,
    discount: 27,
    rating: 4.5,
    reviewCount: 856,
    image: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
    images: [
      'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
      'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg'
    ],
    category: 'Women',
    description: 'Beautiful floral print summer dress with flowing silhouette.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print', 'Solid Blue'],
    inStock: true,
    isBestseller: true
  },
  {
    id: '3',
    name: 'Kids Rainbow T-Shirt',
    brand: 'GAP Kids',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.7,
    reviewCount: 432,
    image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
    images: [
      'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'
    ],
    category: 'Kids',
    description: 'Colorful rainbow t-shirt for kids with soft cotton fabric.',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Rainbow', 'Pink', 'Blue'],
    inStock: true,
    isNew: true
  },
  {
    id: '4',
    name: 'Leather Formal Shoes',
    brand: 'Clarks',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    rating: 4.3,
    reviewCount: 298,
    image: 'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg',
    images: [
      'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg'
    ],
    category: 'Men',
    description: 'Premium leather formal shoes for professional occasions.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black', 'Brown'],
    inStock: true
  },
  {
    id: '5',
    name: 'Designer Handbag',
    brand: 'Michael Kors',
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    rating: 4.6,
    reviewCount: 672,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
    ],
    category: 'Women',
    description: 'Elegant designer handbag with premium leather finish.',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Beige'],
    inStock: true,
    isBestseller: true
  },
  {
    id: '6',
    name: 'Sports Sneakers',
    brand: 'Nike',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.4,
    reviewCount: 1890,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
    ],
    category: 'Sports',
    description: 'High-performance sports sneakers for running and training.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Red'],
    inStock: true,
    isNew: true
  },
  {
    id: '7',
    name: 'Denim Jacket',
    brand: 'Levis',
    price: 2899,
    originalPrice: 3999,
    discount: 28,
    rating: 4.1,
    reviewCount: 543,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'
    ],
    category: 'Men',
    description: 'Classic denim jacket with vintage wash and comfortable fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black', 'Light Blue'],
    inStock: true
  },
  {
    id: '8',
    name: 'Silk Scarf',
    brand: 'Hermès',
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Women',
    description: 'Luxurious silk scarf with elegant pattern and premium quality.',
    sizes: ['One Size'],
    colors: ['Pink', 'Blue', 'Gold'],
    inStock: true,
    isBestseller: true
  }
];

export const categories = [
  { id: 'men', name: 'Men', icon: '👔' },
  { id: 'women', name: 'Women', icon: '👗' },
  { id: 'kids', name: 'Kids', icon: '🧸' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'accessories', name: 'Accessories', icon: '👜' }
];

export const brands = ['ZARA', 'H&M', 'GAP Kids', 'Clarks', 'Michael Kors', 'Nike', 'Levis', 'Hermès'];