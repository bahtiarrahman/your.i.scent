# 📖 Dokumentasi Lengkap - your.i scent

> E-commerce website premium perfumes dengan sistem quiz rekomendasi dan admin panel

---

## 📋 Daftar Isi

1. [Overview Project](#overview-project)
2. [Struktur Folder](#struktur-folder)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Fitur Utama](#fitur-utama)
5. [Alur Data & Single Source of Truth](#alur-data--single-source-of-truth)
6. [Detail Fitur per Modul](#detail-fitur-per-modul)
7. [Cara Kerja Quiz Scoring](#cara-kerja-quiz-scoring)
8. [Admin Panel](#admin-panel)
9. [Data Management](#data-management)
10. [Tips Development](#tips-development)

---

## 🎯 Overview Project

**your.i scent** adalah e-commerce untuk menjual parfum premium dengan 3 kategori:
- **Decant**: Parfum dalam ukuran kecil (2ml, 5ml, 10ml)
- **Preloved**: Parfum bekas pakai
- **BNIB** (Brand New In Box): Parfum baru sealed

**Keunikan:**
- ✅ Quiz interaktif untuk rekomendasi parfum berdasarkan preferensi user
- ✅ Admin panel lengkap untuk kelola produk, brand, order, payment, dan quiz settings
- ✅ Sistem scoring otomatis dengan bobot berbeda per parameter
- ✅ Single source of truth untuk scent types (sinkronisasi otomatis)
- ✅ Multi-select scent types (1 parfum bisa punya banyak aroma)

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── components/           # Komponen reusable
│   │   ├── layout/          # Layout components
│   │   │   ├── AdminLayout.tsx      # Layout admin dengan sidebar
│   │   │   ├── Header.tsx           # Header utama (navbar user)
│   │   │   └── Footer.tsx           # Footer
│   │   ├── ProductCard.tsx          # Card produk di katalog
│   │   ├── AromaExperience.tsx      # Visualisasi fragrance pyramid
│   │   ├── DecantSuggestion.tsx     # Suggest decant untuk BNIB/Preloved
│   │   └── ...
│   │
│   ├── pages/                # Halaman-halaman
│   │   ├── HomePage.tsx              # Landing page
│   │   ├── CatalogPage.tsx           # Katalog produk + filter
│   │   ├── ProductPage.tsx           # Detail produk
│   │   ├── QuizPage.tsx              # Quiz rekomendasi
│   │   ├── CartPage.tsx              # Keranjang belanja
│   │   ├── CheckoutPage.tsx          # Checkout
│   │   ├── OrderSuccessPage.tsx      # Konfirmasi order
│   │   │
│   │   └── admin/            # Halaman admin
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminBrands.tsx
│   │       ├── AdminOrders.tsx
│   │       ├── AdminPayments.tsx
│   │       └── quiz/         # Quiz settings (3 tab)
│   │           ├── AdminQuizSettings.tsx  # Main page
│   │           ├── ScentTab.tsx           # Kelola scent types
│   │           ├── ActivityTab.tsx        # Kelola aktivitas
│   │           ├── StyleTab.tsx           # Kelola kepribadian
│   │           └── Shared.tsx             # Komponen shared
│   │
│   ├── context/              # React Context (state management)
│   │   ├── ProductsContext.tsx       # Kelola produk + localStorage
│   │   ├── CartContext.tsx           # Keranjang belanja
│   │   ├── AuthContext.tsx           # Login admin
│   │   ├── BrandContext.tsx          # Kelola brand
│   │   ├── OrderContext.tsx          # Kelola order
│   │   └── PaymentContext.tsx        # Kelola payment methods
│   │
│   ├── data/                 # Data & config
│   │   ├── products.ts               # Interface + data produk
│   │   ├── brands.ts                 # Data brand
│   │   ├── quizConfig.ts             # Quiz config (scent, activity, style)
│   │   └── paymentMethods.ts         # Payment methods
│   │
│   └── App.tsx               # Main app dengan routing
│
└── styles/                   # CSS files
    ├── fonts.css
    └── theme.css
```

---

## 🛠️ Teknologi yang Digunakan

- **React 18** + **TypeScript** - UI framework
- **React Router v7** - Routing
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **localStorage** - Data persistence (produk, cart, orders, dll)
- **Context API** - State management

---

## ⭐ Fitur Utama

### 1. **User Features**
- Browse katalog dengan filter (brand, scent, harga, intensity, stok)
- Detail produk dengan fragrance pyramid & decant suggestion
- Quiz rekomendasi parfum (4 pertanyaan)
- Keranjang belanja + checkout
- Multi-variant support (untuk decant)

### 2. **Admin Features**
- Login admin (password: `admin123`)
- Dashboard statistik
- Kelola produk (tambah/edit/hapus, multi-scent support)
- Kelola brand
- Kelola order
- Kelola payment methods
- **Quiz Settings** (kelola scent types, activities, personality styles)

### 3. **Quiz System**
- 4 pertanyaan: Scent preference, Activity, Intensity, Personality
- Auto scoring dengan bobot berbeda
- Rekomendasi produk berdasarkan total score tertinggi

---

## 🔄 Alur Data & Single Source of Truth

### **Quiz Settings = Single Source of Truth**

Semua scent types, activities, dan personality styles dikelola di **Quiz Settings** (`/admin/quiz-settings`).

**File:** `/src/app/data/quizConfig.ts`

```typescript
export interface QuizConfig {
  scentTypes: ScentTypeConfig[];   // Fresh, Citrus, Woody, dll
  activities: ActivityConfig[];    // Traveling, Office, dll
  styles: StyleConfig[];           // Adventurous, Romantic, dll
}
```

**Sinkronisasi otomatis ke:**
1. **Form Admin Produk** → dropdown scent types dinamis
2. **Katalog User** → filter scent types dinamis
3. **Quiz Page** → pilihan quiz dinamis
4. **Product Card & Detail** → label badge dinamis

**Cara kerja:**
```typescript
// Load dari localStorage (atau default)
import { loadQuizConfig } from '../data/quizConfig';

const config = loadQuizConfig();
const scentTypes = config.scentTypes; // [{ id: 'fresh', label: 'Fresh', colorPreset: 'aqua' }, ...]

// Admin tambah scent baru di Quiz Settings
// → Otomatis muncul di form produk
// → Otomatis muncul di filter katalog
// → Otomatis muncul di quiz user
```

---

## 📦 Detail Fitur per Modul

### 🏠 **1. Homepage** (`HomePage.tsx`)

**File terlibat:**
- `/src/app/pages/HomePage.tsx`
- `/src/app/components/ProductCard.tsx`
- `/src/app/context/ProductsContext.tsx`

**Alur:**
1. Load produk dari `ProductsContext`
2. Filter produk `featured: true`
3. Tampilkan dalam grid dengan `ProductCard`
4. Hero section + CTA ke quiz & katalog

---

### 🛍️ **2. Katalog** (`CatalogPage.tsx`)

**File terlibat:**
- `/src/app/pages/CatalogPage.tsx`
- `/src/app/components/ProductCard.tsx`
- `/src/app/data/quizConfig.ts`

**Filter yang tersedia:**
1. **Quick Category Pills** - Decant, Preloved, BNIB
2. **Brand Dropdown** - Load dari `BrandContext`
3. **Scent Dropdown** - Load dinamis dari `quizConfig.scentTypes`
4. **Price Range** - Min & Max input
5. **Intensity** - Toggle 1-5
6. **Hide Out of Stock** - Checkbox

**Alur filter:**
```typescript
// 1. Load scent options dari Quiz Config
const scentOptions = useMemo(() => {
  const cfg = loadQuizConfig();
  return [
    { value: 'all', label: 'Semua Aroma' },
    ...cfg.scentTypes.map(s => ({ value: s.id, label: s.label }))
  ];
}, []);

// 2. Filter produk
let filtered = products;

if (category !== 'all') 
  filtered = filtered.filter(p => p.category === category);

if (brand !== 'all') 
  filtered = filtered.filter(p => p.brandId === brand);

if (scent !== 'all') 
  filtered = filtered.filter(p => p.scentType.includes(scent));

if (priceMin || priceMax) 
  filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);

if (intensities.length > 0) 
  filtered = filtered.filter(p => intensities.includes(p.intensity));

if (hideOutOfStock) 
  filtered = filtered.filter(p => p.stock > 0);
```

---

### 🧴 **3. Detail Produk** (`ProductPage.tsx`)

**File terlibat:**
- `/src/app/pages/ProductPage.tsx`
- `/src/app/components/AromaExperience.tsx`
- `/src/app/components/DecantSuggestion.tsx`
- `/src/app/data/quizConfig.ts`

**Komponen utama:**

#### a. **Product Info Section**
- Badge category (Decant/Preloved/BNIB)
- Badge scent types (dinamis dari quiz config)
- Brand, nama, harga
- Variant picker (untuk decant multi-size)
- Deskripsi

#### b. **Aroma Experience** (`AromaExperience.tsx`)
Visualisasi fragrance pyramid dengan:
- **Fragrance Pyramid**: Top → Middle → Base Notes (dari `product.notes`)
- **Intensity Level**: Bar 1-5 dengan label
- **Color Representation**: Gradient warna berdasarkan scent type
- **Penjelasan Notes**: Edukatif tentang top/middle/base notes

**Logic:**
```typescript
const cfg = SCENT_CONFIG[product.scentType[0] || 'fresh'];
// Ambil tema warna dari scent pertama

const pyramidLayers = [
  { label: 'Top Notes',    notes: product.notes.top    },
  { label: 'Middle Notes', notes: product.notes.middle },
  { label: 'Base Notes',   notes: product.notes.base   },
];
```

#### c. **Decant Suggestion** (`DecantSuggestion.tsx`)
Hanya muncul untuk **BNIB** dan **Preloved**.

**Logic:**
```typescript
// Cari decant dengan scent type yang overlap
let decants = PRODUCTS.filter(p => 
  p.category === 'decant' && 
  p.scentType.some(s => product.scentType.includes(s))
).slice(0, 3);

// Fallback: cari decant yang ada stock
if (decants.length === 0) {
  decants = PRODUCTS.filter(p => p.category === 'decant' && p.stock > 0);
}
```

#### d. **Related Products**
Produk serupa berdasarkan scent type overlap atau kategori sama.

---

### 🎯 **4. Quiz Rekomendasi** (`QuizPage.tsx`)

**File terlibat:**
- `/src/app/pages/QuizPage.tsx`
- `/src/app/data/quizConfig.ts`
- `/src/app/data/products.ts`

**4 Pertanyaan:**

| No | Pertanyaan | Sumber Data | Bobot Scoring |
|----|-----------|-------------|---------------|
| Q1 | Aroma favorit? | `quizConfig.scentTypes` | **+40 poin** (terbesar) |
| Q2 | Aktivitas? | `quizConfig.activities` | **+25 poin** |
| Q3 | Intensity? | 1-5 (Ringan - Kuat) | **+15 poin** |
| Q4 | Personality? | `quizConfig.styles` | **+20 poin** |

**Alur Quiz:**
```
[Start] → Q1 → Q2 → Q3 → Q4 → [Calculate Score] → [Show Results]
```

**Cara Kerja Scoring:**

```typescript
// 1. Load quiz config
const quizConfig = loadQuizConfig();

// 2. Scoring per produk
const scored = products.map(p => {
  let score = 0;
  const reasons: string[] = [];

  // ✅ Q1: Scent match (+40)
  if (answers.scent && p.scentType.includes(answers.scent as ScentType)) {
    score += 40;
    reasons.push(`Aroma ${scentDescriptions[answers.scent]}`);
  }

  // ✅ Q2: Activity match (+25)
  if (answers.activity) {
    const activityCfg = quizConfig.activities.find(a => a.id === answers.activity);
    if (activityCfg && p.scentType.some(s => activityCfg.scents.includes(s))) {
      score += 25;
      reasons.push(`Cocok untuk ${activityCfg.label.toLowerCase()}`);
    }
  }

  // ✅ Q3: Intensity range match (+15)
  if (answers.intensity && answers.activity) {
    const activityCfg = quizConfig.activities.find(a => a.id === answers.activity);
    if (activityCfg) {
      const intensity = Number(answers.intensity);
      if (intensity >= activityCfg.intensityMin && intensity <= activityCfg.intensityMax) {
        score += 15;
        reasons.push(`Intensity ideal (${INTENSITY_LABELS[intensity]})`);
      }
    }
  }

  // ✅ Q4: Personality match (+20)
  if (answers.personality) {
    const styleCfg = quizConfig.styles.find(s => s.id === answers.personality);
    if (styleCfg && p.scentType.some(s => styleCfg.scents.includes(s))) {
      score += 20;
      reasons.push(`Sesuai kepribadian ${styleCfg.label}`);
    }
  }

  return { product: p, score, reasons };
});

// 3. Sort by score descending
scored.sort((a, b) => b.score - a.score);

// 4. Ambil top recommendation
const topRecommendation = scored[0];
```

**Maximum Score:** 40 + 25 + 15 + 20 = **100 poin**

---

### 🛒 **5. Keranjang & Checkout**

**File terlibat:**
- `/src/app/pages/CartPage.tsx`
- `/src/app/pages/CheckoutPage.tsx`
- `/src/app/context/CartContext.tsx`
- `/src/app/context/OrderContext.tsx`

**Alur Checkout:**
```
[Cart] → [Checkout Form] → [Submit Order] → [Order Success]
          ↓
    - Nama, Email, Phone
    - Alamat
    - Payment Method
```

**CartContext Methods:**
```typescript
addToCart(product)      // Tambah produk ke cart
removeFromCart(id)      // Hapus item
updateQty(id, qty)      // Update quantity
clearCart()             // Kosongkan cart
```

**Order Creation:**
```typescript
const order = {
  id: `ORD-${Date.now()}`,
  items: cartItems,
  customer: { name, email, phone, address },
  payment: selectedPayment,
  total: totalPrice,
  status: 'pending',
  createdAt: new Date().toISOString()
};

addOrder(order);        // Simpan ke OrderContext
clearCart();            // Kosongkan cart
navigate('/order-success');
```

---

## 👨‍💼 Admin Panel

### 🔐 **Login** (`AdminLogin.tsx`)

**Kredensial:**
- Username: `admin`
- Password: `admin123`

**File:** `/src/app/context/AuthContext.tsx`

```typescript
const login = (username: string, password: string) => {
  if (username === 'admin' && password === 'admin123') {
    setAdmin({ isLoggedIn: true, username: 'admin' });
    localStorage.setItem('admin', JSON.stringify({ username: 'admin' }));
    return true;
  }
  return false;
};
```

---

### 📊 **Dashboard** (`AdminDashboard.tsx`)

**Statistik yang ditampilkan:**
- Total Produk
- Total Order
- Total Brand
- Revenue (dari order dengan status 'completed')

**Recent Orders** - 5 order terbaru

---

### 📦 **Kelola Produk** (`AdminProducts.tsx`)

**File terlibat:**
- `/src/app/pages/admin/AdminProducts.tsx`
- `/src/app/context/ProductsContext.tsx`
- `/src/app/data/quizConfig.ts`

**Fitur:**
- ✅ Tambah produk baru
- ✅ Edit produk existing
- ✅ Hapus produk
- ✅ Multi-select scent types (bisa pilih lebih dari 1)
- ✅ Variant support untuk decant (2ml, 5ml, 10ml)
- ✅ Upload gambar (URL)
- ✅ Input fragrance notes (top, middle, base)

**Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Nama Produk | Text | ✅ | - |
| Brand | Dropdown | ✅ | Load dari BrandContext |
| Kategori | Radio | ✅ | Decant / Preloved / BNIB |
| **Jenis Aroma** | **Multi-select** | ✅ | **Load dinamis dari Quiz Settings** |
| Top Notes | Chips | ✅ | Input + Enter |
| Middle Notes | Chips | ✅ | - |
| Base Notes | Chips | ✅ | - |
| Intensity | Range 1-5 | ✅ | - |
| Harga | Number | ✅ | - |
| Harga Asli | Number | - | Untuk diskon |
| Stok | Number | ✅ | - |
| Size | Text | - | Misal: 100ml |
| Condition | Text | - | Untuk Preloved |
| Gambar URL | Text | ✅ | - |
| Deskripsi | Textarea | ✅ | - |
| Featured | Checkbox | - | Tampil di homepage |
| **Varian Ukuran** | **Dynamic** | - | **Khusus Decant** |

**Multi-Scent Logic:**
```typescript
// Load scent types dari Quiz Settings
const quizConfig = useMemo(() => loadQuizConfig(), []);

const SCENT_TYPES = useMemo(() => 
  quizConfig.scentTypes.map(s => s.id), 
  [quizConfig]
);

// Toggle scent type
const toggleScent = (scentId: string) => {
  setForm(f => ({
    ...f,
    scentType: f.scentType.includes(scentId)
      ? f.scentType.filter(s => s !== scentId)  // Remove
      : [...f.scentType, scentId]                // Add
  }));
};
```

**Decant Variant Management:**
```typescript
interface DecantVariant {
  size: string;    // "2ml", "5ml", "10ml"
  price: number;
  stock: number;
}

// Form khusus decant
{form.category === 'decant' && (
  <div>
    <label>Varian Ukuran</label>
    {variants.map((v, idx) => (
      <div key={idx}>
        <input value={v.size} onChange={...} />
        <input value={v.price} onChange={...} />
        <input value={v.stock} onChange={...} />
        <button onClick={() => removeVariant(idx)}>Hapus</button>
      </div>
    ))}
    <button onClick={addVariant}>+ Tambah Varian</button>
  </div>
)}
```

---

### 🎨 **Kelola Brand** (`AdminBrands.tsx`)

**CRUD operations untuk brand:**
- Tambah brand (nama + logo URL)
- Edit brand
- Hapus brand (cek dulu apakah ada produk yang pakai)

---

### 📋 **Kelola Order** (`AdminOrders.tsx`)

**Fitur:**
- View semua order
- Update status order: `pending` → `processing` → `completed` / `cancelled`
- Filter by status
- Detail order: items, customer, payment method

---

### 💳 **Kelola Payment Methods** (`AdminPayments.tsx`)

**CRUD payment methods:**
- Nama (BCA, Mandiri, OVO, dll)
- Tipe (bank_transfer, e-wallet, cod)
- Detail (nomor rekening, nama pemilik)
- Logo URL
- Status aktif/nonaktif

---

### ⚙️ **Quiz Settings** (`AdminQuizSettings.tsx`)

**File terlibat:**
- `/src/app/pages/admin/quiz/AdminQuizSettings.tsx` (main)
- `/src/app/pages/admin/quiz/ScentTab.tsx`
- `/src/app/pages/admin/quiz/ActivityTab.tsx`
- `/src/app/pages/admin/quiz/StyleTab.tsx`
- `/src/app/pages/admin/quiz/Shared.tsx`
- `/src/app/data/quizConfig.ts`

**3 Tab:**

#### 📍 **Tab 1: Tipe Aroma** (`ScentTab.tsx`)

Kelola scent types yang muncul di quiz Q1 dan form produk.

**Fields:**
- Nama Aroma (misal: Fresh, Citrus, Spicy)
- ID Internal (harus cocok dengan `product.scentType`)
- Color Preset (10 pilihan: Aqua, Rose, Woody, dll)

**Color Presets:**
```typescript
export const COLOR_PRESETS = [
  { id: 'aqua',   name: 'Aqua',   bg: '#EAF6F9', border: '#4AACBF', ... },
  { id: 'pink',   name: 'Rose',   bg: '#FBF0F4', border: '#D4819A', ... },
  { id: 'brown',  name: 'Woody',  bg: '#F5EDE0', border: '#A07040', ... },
  // ... 7 lainnya
];
```

**Logic:**
```typescript
// Tambah scent type baru
const handleSave = (item: ScentTypeConfig) => {
  onUpdate([...scentTypes, item]);
};

// Edit existing
const handleSave = (item: ScentTypeConfig) => {
  onUpdate(scentTypes.map(s => s.id === item.id ? item : s));
};

// Hapus (minimal 1 harus ada)
const canDelete = scentTypes.length > 1;
```

#### 📍 **Tab 2: Aktivitas** (`ActivityTab.tsx`)

Kelola aktivitas untuk quiz Q2.

**Fields:**
- Nama Aktivitas (misal: Traveling, Office Work)
- Deskripsi singkat
- ID Internal
- **Aroma yang Cocok** (multi-select dari scent types) → **+25 poin**
- **Range Kekuatan Ideal** (min-max 1-5) → **+15 poin**

**Logic:**
```typescript
// Activity cocok dengan produk jika scent overlap
if (p.scentType.some(s => activityCfg.scents.includes(s))) {
  score += 25;
}

// Intensity dalam range
if (p.intensity >= activityCfg.intensityMin && 
    p.intensity <= activityCfg.intensityMax) {
  score += 15;
}
```

**Komponen Shared:**
- `ScentToggle` - Badge klik untuk toggle scent
- `IntensityRange` - Pilih range 1-5 secara visual

#### 📍 **Tab 3: Kepribadian** (`StyleTab.tsx`)

Kelola personality styles untuk quiz Q4.

**Fields:**
- Nama Kepribadian (misal: Adventurous, Romantic)
- Deskripsi singkat
- ID Internal
- **Aroma yang Cocok** (multi-select) → **+20 poin**

**Logic:**
```typescript
if (p.scentType.some(s => styleCfg.scents.includes(s))) {
  score += 20;
}
```

---

### 💾 **Simpan & Reset Quiz Config**

**Simpan:**
```typescript
const handleSave = () => {
  saveQuizConfig(config);  // Save ke localStorage
  setSaved(true);
  setTimeout(() => setSaved(false), 2500);
};
```

**Reset ke Default:**
```typescript
const handleReset = () => {
  resetQuizConfig();          // Hapus dari localStorage
  setConfig(loadQuizConfig()); // Load ulang default
};
```

**localStorage key:** `quizConfig`

---

## 💾 Data Management

### **localStorage Keys:**

| Key | Data | Managed By |
|-----|------|-----------|
| `products` | Product[] | ProductsContext |
| `brands` | Brand[] | BrandContext |
| `cart` | CartItem[] | CartContext |
| `orders` | Order[] | OrderContext |
| `payments` | PaymentMethod[] | PaymentContext |
| `quizConfig` | QuizConfig | quizConfig.ts |
| `admin` | { username } | AuthContext |

### **Data Migration**

**ProductsContext** memiliki auto-migration untuk backward compatibility:

```typescript
function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem('products');
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // MIGRATION: convert old scentType (string) → new (array)
      return parsed.map((p: any) => ({
        ...p,
        scentType: Array.isArray(p.scentType) 
          ? p.scentType 
          : [p.scentType]  // Convert string to array
      }));
    }
  } catch {}
  return PRODUCTS;  // Default data
}
```

---

## 🎨 Styling System

### **Tailwind v4**

File konfigurasi: `/src/styles/theme.css`

**Custom CSS Variables:**
```css
@theme {
  --color-primary: #2C2520;
  --color-accent: #C9A96E;
  --color-bg: #FAF8F4;
  /* ... */
}
```

### **Font System**

File: `/src/styles/fonts.css`

**2 Font Families:**
1. **Inter** - Body text, UI elements
2. **Cormorant Garamond** - Headings, product names

**Usage:**
```tsx
<h1 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
  Heading
</h1>
```

### **Color Palette**

| Warna | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#2C2520` | Buttons, headings |
| Gold Accent | `#C9A96E` | Hover, highlights |
| Cream BG | `#FAF8F4` | Background |
| Light Beige | `#EDE8DC` | Borders, badges |
| Text Gray | `#8B7D72` | Secondary text |

---

## 🔧 Tips Development

### **1. Menambah Scent Type Baru**

✅ **CARA BENAR:**
1. Buka `/admin/quiz-settings`
2. Tab "Tipe Aroma"
3. Klik "Tambah Aroma"
4. Input nama, ID, pilih warna
5. Simpan
6. ✨ Otomatis muncul di form produk, katalog, dan quiz

❌ **JANGAN:**
- Edit `products.ts` langsung
- Hardcode di `ProductPage.tsx` atau `CatalogPage.tsx`

---

### **2. Mengubah Bobot Scoring Quiz**

Edit `/src/app/pages/QuizPage.tsx`:

```typescript
// Current weights:
if (scent match) score += 40;     // ← Ubah di sini
if (activity match) score += 25;  // ← Ubah di sini
if (intensity match) score += 15; // ← Ubah di sini
if (style match) score += 20;     // ← Ubah di sini
```

Jangan lupa update info di `AdminQuizSettings.tsx` (line 100-120) juga!

---

### **3. Menambah Kategori Produk Baru**

Misal mau tambah kategori "Travel Size":

**1. Update Type:**
```typescript
// /src/app/data/products.ts
export type Category = 'decant' | 'preloved' | 'bnib' | 'travel';
```

**2. Update Label:**
```typescript
// Di ProductPage.tsx, ProductCard.tsx, dll
const categoryLabel = {
  decant: { label: 'Decant', color: 'bg-[#EDE8DC] text-[#5C5247]' },
  preloved: { label: 'Preloved', color: 'bg-[#3C3327]/10 text-[#3C3327]' },
  bnib: { label: 'BNIB', color: 'bg-[#C9A96E]/15 text-[#8B6914]' },
  travel: { label: 'Travel Size', color: 'bg-blue-50 text-blue-600' }, // ← Tambah
};
```

**3. Update Filter di CatalogPage:**
```tsx
const categories = [
  { value: 'all', label: '✨ Semua', emoji: '✨' },
  { value: 'decant', label: 'Decant', emoji: '🧪' },
  { value: 'preloved', label: 'Preloved', emoji: '♻️' },
  { value: 'bnib', label: 'BNIB', emoji: '📦' },
  { value: 'travel', label: 'Travel', emoji: '✈️' }, // ← Tambah
];
```

---

### **4. Debug localStorage**

Buka Browser Console:

```javascript
// Lihat semua data
console.log('Products:', JSON.parse(localStorage.getItem('products')));
console.log('Quiz Config:', JSON.parse(localStorage.getItem('quizConfig')));
console.log('Cart:', JSON.parse(localStorage.getItem('cart')));

// Clear semua data
localStorage.clear();

// Hapus data tertentu
localStorage.removeItem('products');
```

---

### **5. Testing Quiz Scoring**

Add console.log di `QuizPage.tsx`:

```typescript
const scored = products.map(p => {
  let score = 0;
  const breakdown: any = {};

  if (...) {
    score += 40;
    breakdown.scent = 40;
  }
  // ... dst

  console.log(p.name, 'Score:', score, 'Breakdown:', breakdown);
  return { product: p, score, reasons };
});
```

Lihat console untuk debug scoring per produk.

---

## 📝 Checklist Before Launch

- [ ] Update password admin di `AuthContext.tsx`
- [ ] Ganti semua image URL dengan URL real (sekarang masih placeholder)
- [ ] Test semua flow: browse → quiz → add to cart → checkout
- [ ] Test admin: tambah/edit/hapus produk
- [ ] Test quiz scoring dengan berbagai kombinasi jawaban
- [ ] Validate form inputs (email format, phone number, dll)
- [ ] Add loading states
- [ ] Add error handling
- [ ] Optimize images (compress, lazy load)
- [ ] SEO: meta tags, title, description
- [ ] Mobile responsive check semua halaman
- [ ] Browser compatibility test

---

## 🐛 Known Issues / Future Improvements

1. **Image Upload** - Sekarang masih input URL, belum ada upload file
2. **Payment Integration** - Belum terintegrasi dengan payment gateway real
3. **Order Tracking** - Belum ada tracking number / resi
4. **Email Notification** - Belum ada email konfirmasi order
5. **Search** - Belum ada fitur search produk by nama
6. **Wishlist** - Belum ada fitur simpan produk favorit
7. **Product Reviews** - Belum ada rating & review produk
8. **Admin Analytics** - Dashboard bisa lebih detail (chart, graph)

---

## 📞 Contact

Untuk pertanyaan atau bantuan development, hubungi developer.

---

**Happy Coding! 🚀**
