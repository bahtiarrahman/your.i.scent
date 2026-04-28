# your.i scent — Dokumentasi Proyek

> Platform e-commerce parfum premium: **Decant · Preloved · BNIB**  
> Dibangun dengan React + TypeScript + Tailwind CSS v4

---

## Daftar Isi
1. [Gambaran Umum](#gambaran-umum)
2. [Tech Stack](#tech-stack)
3. [Struktur Folder](#struktur-folder)
4. [Halaman & Route](#halaman--route)
5. [Fitur Pengguna](#fitur-pengguna)
6. [Fitur Admin](#fitur-admin)
7. [Sistem Stok](#sistem-stok)
8. [Sistem Ongkir](#sistem-ongkir)
9. [Fragrance Quiz](#fragrance-quiz)
10. [Format ID Pesanan](#format-id-pesanan)
11. [Kredensial Admin](#kredensial-admin)
12. [Catatan Data](#catatan-data)

---

## Gambaran Umum

**your.i scent** adalah website e-commerce parfum yang menjual tiga kategori produk:

| Kategori | Deskripsi |
|----------|-----------|
| **Decant** | Sample parfum 2ml / 5ml / 10ml dari botol original |
| **Preloved** | Parfum bekas pilihan, kondisi terawat, batch code valid |
| **BNIB** | Brand New In Box — parfum baru original tersegel |

Checkout terintegrasi dengan **WhatsApp**, tidak ada sistem login untuk user biasa. Admin panel tersedia di `/admin`.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Routing | React Router v7 (Data Mode) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context API |
| Persistensi | localStorage (in-memory, belum Supabase) |
| Font | Cormorant Garamond (serif) + Inter (sans) |

---

## Struktur Folder

```
src/
├── app/
│   ├── App.tsx                    # Root, provider wrapper
│   ├── routes.tsx                 # Semua route (React Router)
│   ├── context/
│   │   ├── AuthContext.tsx        # Sesi admin
│   │   ├── CartContext.tsx        # State keranjang + validasi stok
│   │   └── ProductsContext.tsx    # State produk global (localStorage)
│   ├── data/
│   │   ├── products.ts            # Data produk + type definitions
│   │   ├── brands.ts              # Data brand
│   │   └── orders.ts             # Mock orders + generateOrderId()
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx     # Layout halaman publik
│   │   │   ├── AdminLayout.tsx    # Layout admin + sidebar
│   │   │   ├── Header.tsx         # Navbar publik
│   │   │   └── Footer.tsx         # Footer
│   │   ├── ProductCard.tsx        # Kartu produk (dengan badge stok)
│   │   ├── AromaExperience.tsx    # Visualisasi aroma di halaman produk
│   │   └── DecantSuggestion.tsx   # Saran decant di halaman BNIB/Preloved
│   └── pages/
│       ├── HomePage.tsx
│       ├── CatalogPage.tsx
│       ├── ProductPage.tsx
│       ├── CartPage.tsx
│       ├── CheckoutPage.tsx       # Flat-rate ongkir per zona
│       ├── QuizPage.tsx           # Fragrance Quiz
│       ├── AboutPage.tsx
│       ├── ContactPage.tsx
│       └── admin/
│           ├── AdminLoginPage.tsx
│           ├── AdminDashboard.tsx # Grafik: Area chart, Bar chart, Pie chart
│           ├── AdminProducts.tsx  # CRUD produk + manajemen stok
│           ├── AdminBrands.tsx
│           ├── AdminOrders.tsx    # Kelola pesanan + invoice PDF + WA
│           ├── AdminPayments.tsx
│           └── AdminRekap.tsx     # ✨ Rekap penjualan + laporan lengkap
```

---

## Halaman & Route

### Publik
| Route | Halaman |
|-------|---------|
| `/` | Beranda |
| `/catalog` | Katalog produk (filter: kategori, aroma, brand, harga) |
| `/product/:id` | Detail produk |
| `/cart` | Keranjang belanja |
| `/checkout` | Checkout + pilih zona ongkir |
| `/quiz` | Fragrance Quiz |
| `/about` | Tentang Kami |
| `/contact` | Kontak |

### Admin
| Route | Halaman |
|-------|---------|
| `/admin/login` | Login admin |
| `/admin` | Dashboard (grafik) |
| `/admin/products` | Kelola produk + stok |
| `/admin/brands` | Kelola brand |
| `/admin/orders` | Kelola pesanan |
| `/admin/payments` | Pembayaran |
| `/admin/rekap` | **Rekap Penjualan** ✨ |

---

## Fitur Pengguna

### Katalog & Produk
- Filter multi-parameter: kategori, jenis aroma, brand, range harga
- ProductCard menampilkan badge **"Stok Habis"** (overlay grayscale) jika stok = 0
- Badge **"Sisa X"** (orange) jika stok ≤ 3
- Halaman produk: picker varian ukuran (2ml / 5ml / 10ml) untuk decant

### Keranjang
- Validasi stok: tidak bisa tambah item yang stoknya 0
- Qty di-cap sesuai stok produk
- Tombol `+` di-disable otomatis jika sudah di max stok

### Checkout
- 7 zona pengiriman flat-rate:

| Zona | Tarif |
|------|-------|
| Jabodetabek | Rp 12.000 |
| Jawa (luar Jabodetabek) | Rp 15.000 |
| Bali & NTB | Rp 18.000 |
| Sumatera | Rp 22.000 |
| Kalimantan & Sulawesi | Rp 28.000 |
| Maluku & NTT | Rp 38.000 |
| Papua | Rp 50.000 |

- Konfirmasi pesanan dikirim via **WhatsApp** ke nomor toko

### Fragrance Quiz
- Dapat diakses via banner di beranda (`/quiz`)
- 4 parameter scoring:
  - Jenis aroma → +40 poin
  - Aktivitas → +25 poin
  - Intensitas → +15 poin
  - Gaya → +20 poin
  - Penalti budget → -100 poin
- Hasil berupa rekomendasi produk dari katalog

---

## Fitur Admin

### Dashboard
- 4 stat cards: Total Pendapatan, Total Pesanan, Total Produk, Stok Bermasalah
- **Area Chart** tren pendapatan (toggle Mingguan / Bulanan)
- **Bar Chart** top 5 produk terlaris
- **Donut Chart** distribusi kategori pesanan
- Widget pesanan terbaru + alert stok

### Kelola Produk
- CRUD produk lengkap
- Upload gambar: via URL, folder lokal `/public/products/`, atau base64
- Varian ukuran per produk (untuk decant)
- Highlight baris **merah** = stok habis, **orange** = stok ≤ 3

### Kelola Pesanan
- Filter: All / Pending / Selesai
- Edit ongkir (override flat-rate)
- **Invoice**: preview, cetak PDF, kirim via WhatsApp
- Tambah pesanan manual
- Mark pesanan "Selesai" → **stok otomatis berkurang**

### Rekap Penjualan ✨
- KPI cards: Total Pendapatan, Total Pesanan, Avg Order Value, Pertumbuhan MoM
- Grafik area pendapatan 14 hari terakhir
- **Tab Rekapan Bulanan**: tabel detail per bulan + MoM growth
- **Tab Top Produk**: bar chart + tabel 10 produk terlaris dengan tren (naik/turun/stabil)
- **Tab Per Kategori**: card performa + tabel perbandingan bulanan
- Tombol **Cetak / Export PDF**

---

## Sistem Stok

### Alur Stok
1. Stok disimpan di `ProductsContext` (localStorage)
2. Saat user klik "Tambah ke Keranjang":
   - Cek stok produk / varian
   - Jika stok = 0 → tolak, tombol disabled
   - Jika qty cart sudah = stok → tolak
3. Saat admin mark pesanan **"Selesai"**:
   - `reduceStock(productId, qty, variantSize?)` dipanggil otomatis
   - Decant: kurangi stok per varian
   - Preloved/BNIB: kurangi stok utama

### Tipe Data Produk
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  category: 'decant' | 'preloved' | 'bnib';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  size?: string;
  variants?: DecantVariant[];   // untuk decant multi-ukuran
  condition?: string;           // untuk preloved
  scentType: ScentType;
  notes: { top: string[]; middle: string[]; base: string[] };
  intensity: number;            // 1–5
  stock: number;
  featured: boolean;
}

interface DecantVariant {
  size: string;    // '2ml' | '5ml' | '10ml'
  price: number;
  stock: number;   // stok per ukuran
}
```

---

## Format ID Pesanan

| Kategori | Format ID |
|----------|-----------|
| Decant 5ml | `ORD-D5-XXXXX` |
| Decant 2ml | `ORD-D2-XXXXX` |
| Decant 10ml | `ORD-D10-XXXXX` |
| BNIB | `ORD-B-XXXXX` |
| Preloved | `ORD-P-XXXXX` |
| Mix (multi kategori) | `ORD-M-XXXXX` |

`XXXXX` = 5 digit terakhir dari timestamp Unix.

---

## Kredensial Admin

| Field | Value |
|-------|-------|
| URL Login | `/admin/login` |
| Password | `admin123` |

> ⚠️ Ini hanya untuk development. Ganti sebelum production.

---

## Catatan Data

- Semua data saat ini **in-memory + localStorage** (tidak ada backend/database)
- Data produk seed dari `/src/app/data/products.ts`
- Data pesanan seed dari `/src/app/data/orders.ts`
- Perubahan produk (stok, edit, hapus) tersimpan di localStorage key: `youri_products_v1`
- Keranjang tersimpan di localStorage key: `youri_cart`
- Data rekap & grafik menggunakan **mock data historis** (belum real dari DB)

### Integrasi Supabase (belum diimplementasi)
Jika ingin data real & persistent:
- Tabel: `products`, `orders`, `brands`
- Auth admin via Supabase Auth
- Rekap & grafik dari query agregat Supabase

---

*Terakhir diperbarui: April 2026*
