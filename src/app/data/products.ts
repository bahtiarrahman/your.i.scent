export type Category = 'decant' | 'preloved' | 'bnib';
export type ScentType =
  | 'fresh'
  | 'floral'
  | 'woody'
  | 'sweet'
  | 'citrus'
  | 'oriental'
  | 'gourmand'
  | 'fruity'
  | 'spicy'
  | 'musky'
  | 'powdery'
  | 'green';

export interface DecantVariant {
  size: string;   // '2ml', '5ml', '10ml'
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  category: Category;
  price: number;            // base / starting price
  originalPrice?: number;
  image: string;
  description: string;
  size?: string;
  variants?: DecantVariant[]; // multi-size for decants
  condition?: string;
  scentType: ScentType[];   // MULTIPLE scent types untuk 1 parfum
  notes: { top: string[]; middle: string[]; base: string[] };
  intensity: number;        // 1–5  (light → heavy)
  stock: number;
  featured: boolean;
}

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Sorrento',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/sorrento.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['citrus','fresh','spicy'],
    intensity: 3,
    description: 'Aroma citrus aquatic segar khas Mediterania.',
    stock: 20,
    featured: true,
  },
  {
    id: 'p1_pre',
    name: 'Sorrento',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'preloved',
    image: '/products/sorrento.jpg',
    price: 250000,
    originalPrice: 350000,
    size: '100ml',
    condition: '85% – Box Ada',
    scentType: ['citrus','fresh','spicy'],
    intensity: 3,
    description: 'Kondisi masih bagus, wangi segar.',
    stock: 1,
  },
  {
    id: 'p1_bnib',
    name: 'Sorrento',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'bnib',
    image: '/products/sorrento.jpg',
    price: 350000,
    size: '100ml',
    scentType: ['citrus','fresh','spicy'],
    intensity: 3,
    description: 'Baru segel original.',
    stock: 3,
  },

  {
    id: 'p2',
    name: 'Dreamscape',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/dreamscapee.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 12 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['woody','fresh','fruity'],
    intensity: 4,
    description: 'Oriental woody yang dreamy dan elegan.',
    stock: 20,
  },
  {
    id: 'p2_pre',
    name: 'Dreamscape',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'preloved',
    image: '/products/dreamscapee.jpg',
    price: 280000,
    originalPrice: 400000,
    size: '100ml',
    condition: '90%',
    scentType: ['woody','fresh','fruity'],
    intensity: 4,
    description: 'Second, masih sangat layak pakai.',
    stock: 1,
  },

  {
    id: 'p3',
    name: 'California Blue',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/calif_blue.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 25 },
      { size: '5ml', price: 35000, stock: 15 },
      { size: '10ml', price: 60000, stock: 8 },
    ],
    scentType: ['fresh','citrus','fruity'],
    intensity: 4,
    description: 'Fresh clean vibes ala pantai California.',
    stock: 25,
  },

  {
    id: 'p4',
    name: 'Echoes of Aqua',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/echoes_of_aqua.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['fresh','citrus'],
    intensity: 2,
    description: 'Aroma laut bersih dan ringan.',
    stock: 20,
  },

  {
    id: 'p5',
    name: 'Island Dreams',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/island_dreams.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['sweet','floral','fruity'],
    intensity: 3,
    description: 'Tropical sweet yang santai dan fun.',
    stock: 20,
  },

  {
    id: 'p6',
    name: 'Magnetic',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/magnetic.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['woody','oriental'],
    intensity: 5,
    description: 'Bold dan menggoda.',
    stock: 20,
  },

  {
    id: 'p7',
    name: 'Rare Reef',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/rare_reef.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['fresh','green'],
    intensity: 2,
    description: 'Fresh green aquatic unik.',
    stock: 20,
  },

  {
    id: 'p8',
    name: 'Rhythm',
    brand: 'Mykonos',
    brandId: 'b1',
    category: 'decant',
    image: '/products/rhythm.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['spicy','woody'],
    intensity: 4,
    description: 'Spicy warm dengan karakter kuat.',
    stock: 20,
  },

  // =========================
  // VELIXIR
  // =========================

  {
    id: 'p9',
    name: 'Demater',
    brand: 'Velixir',
    brandId: 'b2',
    category: 'decant',
    image: '/products/demater.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 318 },
      { size: '5ml', price: 35000, stock: 0 },
      { size: '10ml', price: 60000, stock: 10 },
    ],
    scentType: ['fresh','green','citrus'],
    intensity: 3,
    description: 'Fresh herbal minty.',
    stock: 318,
  },
  {
    id: 'p9_bnib',
    name: 'Demater',
    brand: 'Velixir',
    brandId: 'b2',
    category: 'bnib',
    image: '/products/demater.jpg',
    price: 300000,
    size: '100ml',
    scentType: ['fresh','green','citrus'],
    intensity: 3,
    description: 'Baru segel.',
    stock: 2,
  },

  {
    id: 'p10',
    name: 'Orangelic',
    brand: 'Velixir',
    brandId: 'b2',
    category: 'decant',
    image: '/products/orangelic.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['citrus','sweet'],
    intensity: 3,
    description: 'Orange sweet fresh.',
    stock: 20,
  },

  {
    id: 'p11',
    name: 'Soapisticated',
    brand: 'Velixir',
    brandId: 'b2',
    category: 'decant',
    image: '/products/soaphisticated.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['fresh','powdery'],
    intensity: 2,
    description: 'Clean laundry vibes.',
    stock: 20,
  },

  {
    id: 'p12',
    name: 'Teasme',
    brand: 'Velixir',
    brandId: 'b2',
    category: 'decant',
    image: '/products/teasme.jpg',
    price: 16000,
    variants: [
      { size: '2ml', price: 16000, stock: 20 },
      { size: '5ml', price: 35000, stock: 10 },
      { size: '10ml', price: 60000, stock: 6 },
    ],
    scentType: ['green','fresh'],
    intensity: 2,
    description: 'Tea fresh calming.',
    stock: 20,
  },
];