export type OrderCategory = 'bnib' | 'preloved' | 'decant';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
  category: OrderCategory;
  size?: string; // untuk decant: '2ml' | '5ml' | '10ml'
}

export interface Order {
  id: string;            // format: ORD-B-xxxxx | ORD-P-xxxxx | ORD-D5-xxxxx | ORD-M-xxxxx
  customerName: string;
  phone: string;
  address: string;
  note: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  shippingStatus: 'tbd' | 'confirmed'; // tbd = belum dikonfirmasi, confirmed = sudah diset admin
  total: number;
  payment: string;
  status: 'pending' | 'selesai';
  createdAt: string;
}

// ─── Utility: generate ID dari items ─────────────────────────────────────────
export function generateOrderId(items: Array<{ category: OrderCategory; size?: string }>): string {
  const ts = Date.now().toString().slice(-5);
  if (items.length === 0) return `ORD-${ts}`;
  const cats = [...new Set(items.map(i => i.category))];
  if (cats.length > 1)           return `ORD-M-${ts}`;
  if (cats[0] === 'bnib')        return `ORD-B-${ts}`;
  if (cats[0] === 'preloved')    return `ORD-P-${ts}`;
  if (cats[0] === 'decant') {
    const sizes = [...new Set(items.filter(i => i.size).map(i => i.size!.replace('ml', '')))];
    if (sizes.length === 1 && sizes[0]) return `ORD-D${sizes[0]}-${ts}`;
    return `ORD-D-${ts}`;
  }
  return `ORD-${ts}`;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-D5-20001',
    customerName: 'Rizky Pratama',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 12, Jakarta Pusat',
    note: 'Tolong bungkus rapi ya kak',
    items: [
      { productId: 'p1', name: 'Replica – Lazy Sunday Morning', brand: 'Maison Margiela', price: 45000, qty: 2, category: 'decant', size: '5ml' },
      { productId: 'p2', name: 'Blanche EDP', brand: 'Byredo', price: 55000, qty: 1, category: 'decant', size: '5ml' },
    ],
    subtotal: 145000,
    shipping: 18000,
    shippingStatus: 'confirmed',
    total: 163000,
    payment: 'Transfer BCA',
    status: 'selesai',
    createdAt: '2026-04-20T10:30:00',
  },
  {
    id: 'ORD-B-25002',
    customerName: 'Salsabila Dewi',
    phone: '089876543210',
    address: 'Jl. Gatot Subroto No. 55, Bandung',
    note: '',
    items: [
      { productId: 'p5', name: 'Sauvage EDP', brand: 'Dior', price: 850000, qty: 1, category: 'bnib' },
    ],
    subtotal: 850000,
    shipping: 18000,
    shippingStatus: 'confirmed',
    total: 868000,
    payment: 'QRIS',
    status: 'pending',
    createdAt: '2026-04-25T14:15:00',
  },
  {
    id: 'ORD-M-27003',
    customerName: 'Farhan Ardiansyah',
    phone: '085611223344',
    address: 'Jl. Raya Bogor No. 88, Depok',
    note: 'Kasih bonus sample dong kak',
    items: [
      { productId: 'p11', name: 'Eros EDT', brand: 'Versace', price: 750000, qty: 1, category: 'bnib' },
      { productId: 'p4', name: 'Oud Wood', brand: 'Tom Ford', price: 55000, qty: 1, category: 'decant', size: '2ml' },
    ],
    subtotal: 805000,
    shipping: 12000,
    shippingStatus: 'confirmed',
    total: 817000,
    payment: 'GoPay / OVO',
    status: 'pending',
    createdAt: '2026-04-27T08:00:00',
  },
];