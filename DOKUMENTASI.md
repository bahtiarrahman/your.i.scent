# 📖 Dokumentasi Website — your.i scent

> Catatan teknis lengkap untuk pengembang & pemilik toko.  
> Terakhir diperbarui: April 2026

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tech Stack](#2-tech-stack)
3. [Desain & Identitas Visual](#3-desain--identitas-visual)
4. [Struktur Folder](#4-struktur-folder)
5. [Routing & Halaman](#5-routing--halaman)
6. [Model Data](#6-model-data)
7. [State Management (Context)](#7-state-management-context)
8. [Alur Belanja User](#8-alur-belanja-user)
9. [Sistem Rekomendasi Quiz](#9-sistem-rekomendasi-quiz)
10. [Panel Admin](#10-panel-admin)
11. [Keterbatasan Saat Ini](#11-keterbatasan-saat-ini)
12. [Roadmap Pengembangan](#12-roadmap-pengembangan)

---

## 1. Gambaran Umum

**your.i scent** adalah website e-commerce parfum premium berbasis React yang menjual tiga kategori produk:

| Kategori | Deskripsi | Contoh Harga |
|---|---|---|
| **Decant** | Sample kecil (2ml / 5ml / 10ml) untuk mencoba | Rp 20.000 – Rp 138.000 |
| **Preloved** | Parfum bekas pakai, kondisi terverifikasi | Rp 600.000 – Rp 2.200.000 |
| **BNIB** | Brand New In Box, tersegel original | Rp 750.000 – Rp 1.850.000 |

**Target pengguna:** Anak muda Indonesia yang ingin mencoba parfum premium sebelum membeli botol penuh.

**Model bisnis:** Pesanan dikirim via WhatsApp → konfirmasi manual → transfer bank / QRIS.

---

## 2. Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | `react-router` (Data Mode / v7) |
| Styling | Tailwind CSS v4 |
| State | React Context API |
| Persistensi | `localStorage` (keranjang + sesi user/admin) |
| Database | ❌ Belum ada — semua data in-memory |
| Checkout | WhatsApp API (`wa.me`) |
| Font | Cormorant Garamond (serif, judul) + Inter (sans, body) |
| Icons | `lucide-react` |

---

## 3. Desain & Identitas Visual

### Palet Warna

| Nama | Hex | Dipakai Untuk |
|---|---|---|
| Dark Brown | `#2C2520` | Background header, teks utama, tombol primer |
| Cream / Base | `#FAF8F4` | Background halaman utama |
| Warm Beige | `#F5F0E8` | Card background, section terpisah |
| Border Linen | `#E0D8CC` | Border semua card & input |
| Gold Accent | `#C9A96E` | Aksen, CTA, progress bar, highlight |
| Medium Gray | `#8B7D72` | Teks sekunder, placeholder |
| Dark Warm | `#5C5247` | Teks body, label |

### Tipografi

```
Judul / Heading → Cormorant Garamond, serif, font-weight: 300–400
Body / UI       → Inter, sans-serif
```

### Warna per Jenis Aroma (Quiz + Admin)

| Jenis | Background | Border | Teks | Dot |
|---|---|---|---|---|
| Fresh | `#EAF6F9` | `#4AACBF` | `#1E6878` | `#4AACBF` |
| Floral | `#FBF0F4` | `#D4819A` | `#8B3A55` | `#D4819A` |
| Woody | `#F5EDE0` | `#A07040` | `#5C3820` | `#A07040` |
| Sweet | `#FDF5E0` | `#C89830` | `#6B5010` | `#C89830` |
| Citrus | `#FEF3E4` | `#D88030` | `#6B4010` | `#D88030` |
| Oriental | `#F0EBF8` | `#8B5EAB` | `#4A2870` | `#8B5EAB` |

---

## 4. Struktur Folder

```
/src/app/
│
├── App.tsx                    # Entry point, mount RouterProvider
├── routes.tsx                 # Definisi semua route (createBrowserRouter)
│
├── data/                      # Data statis (in-memory "database")
│   ├── products.ts            # Daftar produk + type Product, Category, ScentType
│   ├── brands.ts              # Daftar brand + type Brand
│   └── orders.ts              # Mock pesanan + type Order, OrderItem
│
├── context/                   # Global state
│   ├── CartContext.tsx         # State keranjang belanja (disimpan ke localStorage)
│   └── AuthContext.tsx         # State user login + admin login
│
├── pages/                     # Halaman publik
│   ├── HomePage.tsx
│   ├── CatalogPage.tsx
│   ├── ProductPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── QuizPage.tsx           # ⭐ Fragrance Quiz + algoritma rekomendasi
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── LoginPage.tsx
│   └── DesignSystemPage.tsx   # Hidden route (/design-system), tidak muncul di navbar
│
├── pages/admin/               # Halaman admin (protected)
│   ├── AdminLoginPage.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminProducts.tsx
│   ├── AdminBrands.tsx
│   ├── AdminOrders.tsx
│   └── AdminPayments.tsx
│
└── components/
    ├── ProductCard.tsx
    ├── AromaExperience.tsx
    ├── DecantSuggestion.tsx
    ├── layout/
    │   ├── MainLayout.tsx      # Layout publik (Navbar + Footer)
    │   └── AdminLayout.tsx     # Layout admin (Sidebar)
    └── ui/                    # Komponen UI kecil (button, badge, dll)
```

---

## 5. Routing & Halaman

### Public Routes (layout: MainLayout)

| Path | Halaman | Deskripsi |
|---|---|---|
| `/` | HomePage | Landing page, hero, featured products |
| `/catalog` | CatalogPage | Semua produk, filter kategori & aroma |
| `/product/:id` | ProductPage | Detail produk, pilih varian, tambah ke keranjang |
| `/cart` | CartPage | Keranjang belanja, ubah qty, hapus |
| `/checkout` | CheckoutPage | Form pengiriman + redirect WA |
| `/quiz` | QuizPage | Fragrance Quiz, 4 pertanyaan, hasil rekomendasi |
| `/about` | AboutPage | Tentang toko |
| `/contact` | ContactPage | Kontak & sosmed |
| `/login` | LoginPage | Login user (simpan nama, HP, alamat ke localStorage) |
| `/design-system` | DesignSystemPage | **Hidden** — tidak ada di navbar, hanya untuk ekspor Figma |

### Admin Routes (layout: AdminLayout)

| Path | Halaman | Deskripsi |
|---|---|---|
| `/admin` | AdminDashboard | Statistik ringkas, pesanan terbaru |
| `/admin/login` | AdminLoginPage | Form login admin |
| `/admin/products` | AdminProducts | CRUD produk |
| `/admin/brands` | AdminBrands | CRUD brand |
| `/admin/orders` | AdminOrders | Lihat & ubah status pesanan |
| `/admin/payments` | AdminPayments | Info metode pembayaran |

---

## 6. Model Data

### Product

```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  category: 'decant' | 'preloved' | 'bnib';
  price: number;             // harga dasar / harga terendah varian
  originalPrice?: number;   // untuk tampilkan coret harga (diskon)
  image: string;
  description: string;
  size?: string;             // ukuran tunggal (non-varian)
  variants?: DecantVariant[]; // multi-ukuran khusus decant
  condition?: string;        // kondisi preloved, mis. "85% – Box Ada"
  scentType: ScentType;      // ⭐ dipakai algoritma quiz
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  intensity: number;         // 1–5 (ringan → berat) — dipakai quiz
  stock: number;
  featured: boolean;
}

interface DecantVariant {
  size: string;    // '2ml', '5ml', '10ml'
  price: number;
  stock: number;
}
```

### Brand

```typescript
interface Brand {
  id: string;
  name: string;
  country: string;
  description: string;
}
```

### Order

```typescript
interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'selesai';
  createdAt: string;  // ISO 8601
}

interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
}
```

### Jenis Aroma (ScentType)

```typescript
type ScentType = 'fresh' | 'sweet' | 'woody' | 'citrus' | 'floral' | 'oriental';
```

> ⚠️ **Hardcoded di kode.** Untuk menambah jenis aroma baru, harus edit:
> 1. `src/app/data/products.ts` — tambah ke union type `ScentType`
> 2. `src/app/pages/admin/AdminProducts.tsx` — tambah ke `SCENT_VISUAL` dan `SCENT_TYPES`
> 3. `src/app/pages/QuizPage.tsx` — tambah ke semua mapping affinity + pertanyaan quiz

---

## 7. State Management (Context)

### CartContext (`/src/app/context/CartContext.tsx`)

Mengelola keranjang belanja. **Disimpan ke `localStorage`** (key: `youri_cart`) sehingga tidak hilang saat refresh.

```typescript
// API yang tersedia via useCart()
{
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

**Catatan penting:** Jika qty di-set ke 0 atau kurang, item otomatis dihapus dari keranjang.

---

### AuthContext (`/src/app/context/AuthContext.tsx`)

Mengelola dua jenis sesi secara terpisah:

#### 1. User Login (Pembeli)

Disimpan ke `localStorage` (key: `youri_user`). Data yang disimpan:

```typescript
interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}
```

Data user dipakai untuk **pre-fill form checkout** (nama & HP & alamat otomatis terisi).

#### 2. Admin Login

```
Password: admin123
localStorage key: youri_admin
```

Login admin hanya menyimpan `{ isLoggedIn: true/false }`. Tidak ada JWT atau token. Akses admin terlindungi secara sederhana via state — jika di-refresh, state diambil ulang dari localStorage.

---

## 8. Alur Belanja User

```
[1] User browsing
      │
      ▼
[2] Halaman Produk (/product/:id)
    - Pilih ukuran varian (khusus decant)
    - Lihat top/middle/base notes
    - Lihat intensity bar
    - Klik "Tambah ke Keranjang"
      │
      ▼
[3] Keranjang (/cart)
    - Ubah qty produk
    - Hapus produk
    - Lihat subtotal
    - Klik "Checkout"
      │
      ▼
[4] Checkout (/checkout)
    - Isi: Nama, HP/WA, Alamat, Catatan (opsional)
    - Pilih metode pembayaran:
        • Transfer BCA (1234567890 a.n. Your.i Scent)
        • Transfer Mandiri (0987654321 a.n. Your.i Scent)
        • GoPay / OVO (+62 812-3456-7890)
        • QRIS (scan saat konfirmasi)
    - Klik "Pesan via WhatsApp"
      │
      ▼
[5] Redirect ke WhatsApp
    - Nomor toko: 6281234567890
    - Pesan otomatis berisi:
        • List produk + qty + harga
        • Subtotal, ongkir (Rp 15.000), total
        • Data pengiriman & metode bayar
    - Keranjang di-clear otomatis
    - User diarahkan kembali ke homepage
      │
      ▼
[6] Konfirmasi manual oleh admin via WA
    - Admin cek pesanan di /admin/orders
    - Update status: pending → selesai
```

---

## 9. Sistem Rekomendasi Quiz

> File: `/src/app/pages/QuizPage.tsx`

### Alur Quiz

```
Pertanyaan 1: Aroma favorit?    → id: 'scent'
Pertanyaan 2: Aktivitas utama?  → id: 'activity'
Pertanyaan 3: Kepribadian?      → id: 'style'
Pertanyaan 4: Budget?           → id: 'budget'
```

User memilih 1 opsi per pertanyaan. Setiap klik langsung lanjut ke pertanyaan berikutnya (delay 220ms untuk animasi). Tersedia tombol "Lewati →" jika user tidak mau menjawab.

---

### Algoritma Scoring

Setiap produk dihitung skornya terhadap jawaban user. Skor dihitung dari **4 parameter**:

```
TOTAL SKOR = (scent match) + (activity affinity) + (intensity match) + (style affinity) + (featured bonus) - (budget penalty)
```

#### Bobot Poin

| Parameter | Kondisi | Poin |
|---|---|---|
| **Scent** | `product.scentType === jawaban_scent` | **+40** |
| **Activity Affinity** | scentType produk ada di daftar cocok untuk aktivitas | **+25** |
| **Intensity** | `product.intensity` berada di range ideal aktivitas | **+15** |
| **Style Affinity** | scentType produk ada di daftar cocok untuk kepribadian | **+20** |
| **Featured Bonus** | `product.featured === true` | **+5** |
| **Budget Penalty** | harga produk di luar range budget | **−100** |

**Total skor maksimum:** 40 + 25 + 15 + 20 + 5 = **105 poin**

---

#### Mapping Activity → Jenis Aroma yang Cocok

```
office  → fresh, woody, citrus         (profesional, tidak mencolok)
sport   → fresh, citrus                (ringan, bersih, non-heavy)
date    → oriental, floral, sweet, woody (seduktif, memorable)
casual  → fresh, citrus, sweet, floral  (versatile, fun)
party   → oriental, woody, sweet        (statement, malam hari)
```

#### Mapping Activity → Range Intensity Ideal (skala 1–5)

```
office  → [1, 3]  (tidak terlalu kuat di ruang tertutup)
sport   → [1, 2]  (ringan supaya tidak menyengat saat gerak)
date    → [3, 5]  (perlu daya tahan & kesan)
casual  → [1, 3]  (nyaman sepanjang hari)
party   → [3, 5]  (statement, tahan lama)
```

#### Mapping Style/Kepribadian → Jenis Aroma yang Cocok

```
minimal  → fresh, floral, citrus          (clean, tidak berlebihan)
luxury   → oriental, woody, floral        (mewah, berat, kompleks)
casual   → fresh, citrus, sweet           (everyday, santai)
bold     → oriental, woody                (kuat, intense, berkarakter)
romantic → floral, sweet, oriental        (lembut, dreamy)
```

#### Range Budget

```
low     → harga < Rp 100.000            (cocok untuk decant sample)
mid     → Rp 100.000 – Rp 500.000       (decant besar / preloved entry)
high    → Rp 500.000 – Rp 1.000.000    (preloved premium)
premium → harga > Rp 1.000.000         (BNIB / koleksi)
```

---

### Proses Seleksi Hasil

```typescript
// 1. Hitung skor semua produk
const scored = PRODUCTS.map(p => ({ product: p, score: hitungSkor(p, answers) }));

// 2. Urutkan dari skor tertinggi
scored.sort((a, b) => b.score - a.score);

// 3. Filter: buang produk dengan skor < -50
//    (artinya terkena budget penalty dan tidak ada match lain)
const results = scored.filter(s => s.score > -50);

// 4. Ambil 4 teratas
// Jika hasil < 2, fallback ke 4 produk pertama dari katalog
return results.length >= 2 ? results.slice(0, 4) : PRODUCTS.slice(0, 4);
```

---

### Label Alasan Rekomendasi

Di bawah setiap kartu produk hasil quiz, ditampilkan label alasan kenapa produk itu direkomendasikan:

```
Contoh output: "Fresh & Segar · cocok aktivitasmu · sesuai gayamu"
```

Logikanya:
1. Jika `scentType` cocok → tampilkan nama aroma
2. Jika activity affinity match → tambahkan "cocok aktivitasmu"
3. Jika style affinity match → tambahkan "sesuai gayamu"
4. Jika tidak ada match sama sekali → tampilkan "pilihan terpopuler"

---

### Pertanyaan & Opsi Quiz

#### Pertanyaan 1 — Aroma favorit (id: `scent`)

| Value | Label | Sub |
|---|---|---|
| `fresh` | Fresh & Segar | Ringan, bersih, angin pagi |
| `floral` | Floral | Bunga, feminin, lembut |
| `woody` | Woody & Hangat | Kayu, oud, maskulin |
| `sweet` | Sweet & Gourmand | Manis, vanila, lembut |
| `citrus` | Citrus & Fruity | Buah, segar, ceria |
| `oriental` | Oriental & Misterius | Bold, dalam, berkarakter |

#### Pertanyaan 2 — Aktivitas (id: `activity`)

| Value | Label | Sub |
|---|---|---|
| `office` | Kerja / Kuliah | Profesional, indoor |
| `sport` | Olahraga | Aktif, outdoor |
| `date` | Kencan | Romantis, evening |
| `casual` | Jalan Santai | Casual, weekend |
| `party` | Pesta & Event | Malam, statement |

#### Pertanyaan 3 — Kepribadian (id: `style`)

| Value | Label | Sub |
|---|---|---|
| `minimal` | Minimalis | Clean, sederhana, elegan |
| `luxury` | Elegan | Premium, berkelas |
| `casual` | Kasual | Santai, versatile |
| `bold` | Bold | Berani, ekspresif |
| `romantic` | Romantis | Feminin, dreamy |

#### Pertanyaan 4 — Budget (id: `budget`)

| Value | Label | Sub |
|---|---|---|
| `low` | Di bawah Rp 100k | Cocok untuk decant sample |
| `mid` | Rp 100k – 500k | Decant besar / preloved entry |
| `high` | Rp 500k – 1 Juta | Preloved premium |
| `premium` | Di atas Rp 1 Juta | BNIB / koleksi |

---

## 10. Panel Admin

### Akses

```
URL      : /admin/login
Password : admin123
```

Sesi admin disimpan di `localStorage` (key: `youri_admin`). Jika sudah pernah login, tidak perlu input password lagi saat refresh.

---

### Halaman Admin

#### Dashboard (`/admin`)

Menampilkan:
- 4 stat card: Total Produk, Total Pesanan, Total Brand, Produk Unggulan
- Daftar pesanan terbaru (5 terakhir)
- Breakdown produk per kategori (bar chart sederhana)
- Status pesanan (pending vs selesai)
- Total pendapatan dari pesanan selesai

#### Kelola Produk (`/admin/products`)

Fitur:
- Tabel semua produk dengan pencarian
- Tambah produk baru via modal
- Edit produk via modal
- Hapus produk (dengan konfirmasi)

Form tambah/edit produk mencakup:
- Nama, Brand (dropdown)
- Kategori: Decant / Preloved / BNIB (toggle pill)
- **Jenis Aroma** — visual color pills (fresh, floral, woody, sweet, citrus, oriental)
- **Kekuatan Aroma** — skala 1–5 (dipakai quiz untuk filter intensity)
- Varian ukuran (khusus decant): 2ml / 5ml / 10ml + harga + stok masing-masing
- Harga, Stok (untuk non-varian)
- Harga asli (untuk coret harga / tampilkan diskon)
- Ukuran single & Kondisi (untuk preloved)
- Upload foto (dari file lokal atau URL)
- Deskripsi
- Top Notes, Middle Notes, Base Notes (pisah koma)
- Toggle: Produk Unggulan

> ⭐ **Jenis Aroma** dan **Kekuatan Aroma** langsung berpengaruh ke hasil quiz. Admin wajib mengisi ini dengan akurat.

#### Kelola Brand (`/admin/brands`)

CRUD brand: nama, negara asal, deskripsi.

#### Kelola Pesanan (`/admin/orders`)

Fitur:
- Filter: Semua / Pending / Selesai
- Pencarian by nama pelanggan atau ID pesanan
- Expand detail pesanan (info pelanggan + item)
- Ubah status: pending ↔ selesai
- Tombol "Hubungi via WA" langsung ke nomor pelanggan

#### Kelola Pembayaran (`/admin/payments`)

Informasi metode pembayaran yang tersedia:
- Transfer BCA: `1234567890 a.n. Your.i Scent`
- Transfer Mandiri: `0987654321 a.n. Your.i Scent`
- GoPay / OVO: `+62 812-3456-7890`
- QRIS: scan saat konfirmasi WA

---

## 11. Keterbatasan Saat Ini

| Keterbatasan | Detail |
|---|---|
| **Data hilang saat deploy ulang** | Semua produk, brand, orders adalah data hardcode in-memory. Perubahan di admin panel hanya berlaku selama sesi browser aktif. Reload = reset ke data awal. |
| **Tidak ada database** | Belum terhubung ke Supabase atau backend apapun |
| **Pesanan tidak tersimpan** | Pesanan dari WhatsApp tidak masuk ke `/admin/orders` secara otomatis — harus input manual |
| **Auth sangat sederhana** | Password admin hardcoded di kode (`admin123`). Tidak ada JWT, tidak ada hashing. |
| **Tidak ada notifikasi** | Admin tidak dapat notifikasi real-time saat ada pesanan baru |
| **Jenis aroma tidak bisa diubah dari admin** | Harus edit kode langsung (lihat roadmap) |
| **Pertanyaan quiz tidak bisa diubah dari admin** | Idem, hardcoded di `QuizPage.tsx` |
| **Ongkir flat** | Ongkir selalu Rp 15.000 tanpa mempertimbangkan jarak/berat |
| **Tidak ada tracking pesanan** | User tidak bisa cek status pesanan sendiri |

---

## 12. Roadmap Pengembangan

### Tahap 1 — Perbaikan Minor (Sekarang, Tanpa Database)

- [ ] Tambah jenis aroma: **Aquatic** dan **Oud** (hardcode)
- [ ] Tambah filter harga di halaman katalog
- [ ] Tambah sorting (termurah, terpopuler, terbaru)
- [ ] Halaman 404 Not Found
- [ ] Animasi transisi halaman

### Tahap 2 — Koneksi Database (Supabase)

- [ ] Setup Supabase project
- [ ] Migrasi `PRODUCTS` → tabel `products` di Supabase
- [ ] Migrasi `BRANDS` → tabel `brands` di Supabase
- [ ] Pesanan dari WA tersimpan otomatis ke tabel `orders`
- [ ] Admin panel baca/tulis dari Supabase (bukan in-memory)
- [ ] Auth admin via Supabase Auth (bukan password hardcode)

### Tahap 3 — Fitur Admin-Configurable (Butuh Database)

- [ ] Kelola jenis aroma dari admin (tambah/hapus/ubah warna)
- [ ] Kelola pertanyaan quiz dari admin
- [ ] Kelola mapping affinity dari admin (activity → aroma)
- [ ] Kelola bobot skor quiz dari admin (slider)

### Tahap 4 — Fitur E-commerce Lanjutan

- [ ] Integrasi payment gateway (Midtrans / Xendit)
- [ ] Notifikasi pesanan real-time (Supabase Realtime)
- [ ] Sistem review & rating produk
- [ ] Wishlist / favorit
- [ ] Tracking pesanan untuk user
- [ ] Kalkulasi ongkir otomatis (RajaOngkir API)
- [ ] Promo code / voucher diskon
- [ ] Loyalty points

---

## Catatan untuk Developer

### Menambah Produk Baru (Cara Cepat)

1. Buka `/admin/products`
2. Klik "Tambah Produk"
3. Isi semua field, pastikan **Jenis Aroma** dan **Kekuatan Aroma** diisi dengan akurat
4. Klik Simpan

> ⚠️ Perubahan hanya berlaku selama sesi browser aktif (belum ada database).

### Menambah Jenis Aroma Baru (Hardcode)

Harus edit 3 file:

```typescript
// 1. src/app/data/products.ts
type ScentType = 'fresh' | 'sweet' | 'woody' | 'citrus' | 'floral' | 'oriental' | 'aquatic'; // tambah di sini

// 2. src/app/pages/admin/AdminProducts.tsx
const SCENT_VISUAL = {
  ...
  aquatic: { label: 'Aquatic', bg: '#EAF3FB', border: '#4A90D9', text: '#1A4A78', dot: '#4A90D9' },
};
const SCENT_TYPES: ScentType[] = [..., 'aquatic'];

// 3. src/app/pages/QuizPage.tsx
const ACTIVITY_SCENT_AFFINITY = {
  office:  ['fresh', 'woody', 'citrus', 'aquatic'],  // tambah jika relevan
  sport:   ['fresh', 'citrus', 'aquatic'],
  ...
};
const scentDescriptions = {
  ...
  aquatic: 'Aquatic & Marine',
};
// Tambah juga ke opsi pertanyaan pertama (questions array)
```

### Ganti Nomor WhatsApp Toko

```typescript
// src/app/pages/CheckoutPage.tsx
const WA_NUMBER = '6281234567890'; // ganti ini
```

### Ganti Password Admin

```typescript
// src/app/context/AuthContext.tsx
const ADMIN_PASSWORD = 'admin123'; // ganti ini
```

### Menambah Foto Produk Sendiri (Permanen)

Ini cara yang **direkomendasikan** agar foto tidak hilang saat refresh:

```
Langkah 1: Taruh file foto di folder /public/products/
           Contoh: /public/products/sauvage-dior.jpg

Langkah 2: Di Admin → Tambah/Edit Produk → tab "Folder Lokal"
           Ketik nama file: sauvage-dior.jpg
           → Otomatis jadi path: /products/sauvage-dior.jpg

Langkah 3: Simpan produk
```

**Tips penamaan file foto:**
- Huruf kecil semua: `sauvage-dior.jpg` ✅ bukan `Sauvage Dior.JPG` ❌
- Spasi diganti tanda hubung: `oud-wood-tomford.jpg`
- Format yang didukung: jpg, jpeg, png, webp

**Tiga mode input foto di admin:**

| Tab | Cara Kerja | Permanen? |
|---|---|---|
| **Folder Lokal** | Ketik nama file dari `/public/products/` | ✅ Ya |
| **URL Eksternal** | Paste URL dari internet (Unsplash, dll) | ⚠️ Tergantung server luar |
| **Upload** | Upload dari perangkat, jadi base64 | ❌ Hilang saat refresh |

---

*Dokumentasi ini dibuat berdasarkan kondisi kode per April 2026.*