import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react';
import { Category, ScentType } from '../data/products';
import { BRANDS } from '../data/brands';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { loadQuizConfig } from '../data/quizConfig';

const categoryOptions: { value: Category | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'Semua', emoji: '' },
  { value: 'decant', label: 'Decant', emoji: '' },
  { value: 'preloved', label: 'Preloved', emoji: '' },
  { value: 'bnib', label: 'BNIB', emoji: '' },
];

const intensityLabels: Record<number, string> = {
  1: 'Sangat Ringan', 2: 'Ringan', 3: 'Sedang', 4: 'Kuat', 5: 'Sangat Kuat',
};

export function CatalogPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<Category | 'all'>((searchParams.get('cat') as Category) || 'all');
  const [scent, setScent] = useState<string>('all'); // string karena dynamic dari quiz config

  // Load scent options dari Quiz Settings (sinkron dengan admin)
  const scentOptions = useMemo(() => {
    const cfg = loadQuizConfig();
    return [
      { value: 'all', label: 'Semua Aroma' },
      ...cfg.scentTypes.map(s => ({ value: s.id, label: s.label }))
    ];
  }, []);
  const [brand, setBrand] = useState('all');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(1000000);
  const [intensity, setIntensity] = useState<number[]>([]);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  // Calculate price range dari produk yang ada (HARUS DI ATAS useEffect!)
  const globalPriceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000000 };
    const prices = products.map(p => p.price);
    return { min: Math.floor(Math.min(...prices) / 10000) * 10000, max: Math.ceil(Math.max(...prices) / 10000) * 10000 };
  }, [products]);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q) setSearch(q);
    if (cat) setCategory(cat as Category);
  }, [searchParams]);

  // Initialize price range
  useEffect(() => {
    if (priceMin === 0 && priceMax === 1000000 && products.length > 0) {
      setPriceMin(globalPriceRange.min);
      setPriceMax(globalPriceRange.max);
    }
  }, [globalPriceRange, products.length]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (scent !== 'all') list = list.filter(p => p.scentType.includes(scent as ScentType));
    if (brand !== 'all') list = list.filter(p => p.brandId === brand);
    if (priceMin > globalPriceRange.min) list = list.filter(p => p.price >= priceMin);
    if (priceMax < globalPriceRange.max) list = list.filter(p => p.price <= priceMax);
    if (intensity.length > 0) list = list.filter(p => intensity.includes(p.intensity));
    if (hideOutOfStock) list = list.filter(p => p.stock > 0);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, category, scent, brand, priceMin, priceMax, intensity, hideOutOfStock, sortBy, globalPriceRange, products]);

  const resetFilters = () => {
    setSearch(''); setCategory('all'); setScent('all'); setBrand('all');
    setPriceMin(globalPriceRange.min); setPriceMax(globalPriceRange.max);
    setIntensity([]); setHideOutOfStock(false); setSortBy('default');
    setSearchParams({});
  };

  const hasFilters = search || category !== 'all' || scent !== 'all' || brand !== 'all'
    || priceMin > globalPriceRange.min || priceMax < globalPriceRange.max
    || intensity.length > 0 || hideOutOfStock;

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <div className="bg-[#2C2520] py-16 px-4 text-center">
        <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2">Koleksi</div>
        <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300 }}>Katalog Parfum</h1>
        <p className="text-[#8B7D72] mt-2 text-sm">{filtered.length} produk ditemukan</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Category Filter - Always Visible */}
        <div className="mb-5">
          <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">Kategori</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categoryOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCategory(opt.value as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all ${
                  category === opt.value
                    ? 'bg-[#2C2520] border-[#2C2520] text-white shadow-sm'
                    : 'bg-white border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'
                }`}
              >
                <span>{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>


        {/* Search + Brand + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7D72]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama parfum..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E0D8CC] bg-white text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>
          <select
            value={brand}
            onChange={e => setBrand(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#E0D8CC] bg-white text-sm text-[#5C5247] outline-none focus:border-[#C9A96E]"
          >
            <option value="all">Semua Brand</option>
            {BRANDS.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select
            value={scent}
            onChange={e => setScent(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#E0D8CC] bg-white text-sm text-[#5C5247] outline-none focus:border-[#C9A96E]"
          >
            {scentOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#E0D8CC] bg-white text-sm text-[#5C5247] outline-none focus:border-[#C9A96E]"
          >
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga: Rendah → Tinggi</option>
            <option value="price-desc">Harga: Tinggi → Rendah</option>
            <option value="name">Nama: A → Z</option>
          </select>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all whitespace-nowrap ${
              filterOpen || hasFilters
                ? 'bg-[#C9A96E] border-[#C9A96E] text-white shadow-sm'
                : 'bg-white border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filter
            {hasFilters && <span className="w-4 h-4 bg-white/30 rounded-full text-[10px] flex items-center justify-center">!</span>}
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium text-[#2C2520]">Filter Lanjutan</h3>
              {hasFilters && (
                <button onClick={resetFilters} className="text-xs text-[#C9A96E] hover:underline flex items-center gap-1">
                  <X size={12} /> Reset Semua
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Price Range */}
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-2 block">
                  Rentang Harga
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={e => setPriceMin(Number(e.target.value))}
                    placeholder="Min"
                    className="w-1/2 text-xs px-3 py-2 rounded-lg border border-[#E0D8CC] bg-[#FAF8F4] text-[#5C5247] outline-none focus:border-[#C9A96E]"
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    placeholder="Max"
                    className="w-1/2 text-xs px-3 py-2 rounded-lg border border-[#E0D8CC] bg-[#FAF8F4] text-[#5C5247] outline-none focus:border-[#C9A96E]"
                  />
                </div>
                <div className="text-[10px] text-[#8B7D72] mt-1">
                  {priceMin.toLocaleString('id-ID')} - {priceMax.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Zap size={11} /> Kekuatan Wangi
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setIntensity(prev =>
                        prev.includes(lvl) ? prev.filter(i => i !== lvl) : [...prev, lvl]
                      )}
                      title={intensityLabels[lvl]}
                      className={`w-7 h-7 rounded-full text-xs border transition-all ${
                        intensity.includes(lvl)
                          ? 'bg-[#C9A96E] border-[#C9A96E] text-white shadow-sm'
                          : 'border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                {intensity.length > 0 && (
                  <div className="text-[10px] text-[#8B7D72] mt-1">
                    {intensity.sort().map(i => intensityLabels[i]).join(', ')}
                  </div>
                )}
              </div>

              {/* Stock Filter */}
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-2 block">Ketersediaan</label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#FAF8F4] px-3 py-2.5 rounded-lg border border-[#E0D8CC] hover:border-[#C9A96E] transition-colors">
                  <input
                    type="checkbox"
                    checked={hideOutOfStock}
                    onChange={e => setHideOutOfStock(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C9A96E] text-[#C9A96E] focus:ring-[#C9A96E]"
                  />
                  <span className="text-xs text-[#5C5247]">Sembunyikan produk habis</span>
                </label>
              </div>
              </div>
            </div>
        )}

        {/* Active filter tags */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-5 items-center">
            <span className="text-xs text-[#8B7D72]">Filter aktif:</span>
            {search && (
              <span className="text-xs px-3 py-1 bg-[#2C2520] text-white rounded-full flex items-center gap-1.5">
                "{search}" <button onClick={() => setSearch('')}><X size={10} /></button>
              </span>
            )}
            {category !== 'all' && (
              <span className="text-xs px-3 py-1 bg-[#2C2520] text-white rounded-full flex items-center gap-1.5">
                {categoryOptions.find(c => c.value === category)?.emoji} {category} <button onClick={() => setCategory('all')}><X size={10} /></button>
              </span>
            )}
            {scent !== 'all' && (
              <span className="text-xs px-3 py-1 bg-[#C9A96E] text-white rounded-full flex items-center gap-1.5">
                {scentOptions.find(s => s.value === scent)?.label} <button onClick={() => setScent('all')}><X size={10} /></button>
              </span>
            )}
            {brand !== 'all' && (
              <span className="text-xs px-3 py-1 bg-[#C9A96E] text-white rounded-full flex items-center gap-1.5">
                {BRANDS.find(b => b.id === brand)?.name} <button onClick={() => setBrand('all')}><X size={10} /></button>
              </span>
            )}
            {(priceMin > globalPriceRange.min || priceMax < globalPriceRange.max) && (
              <span className="text-xs px-3 py-1 bg-[#C9A96E] text-white rounded-full flex items-center gap-1.5">
                Rp{priceMin.toLocaleString('id-ID')} - {priceMax.toLocaleString('id-ID')}
                <button onClick={() => { setPriceMin(globalPriceRange.min); setPriceMax(globalPriceRange.max); }}><X size={10} /></button>
              </span>
            )}
            {intensity.length > 0 && (
              <span className="text-xs px-3 py-1 bg-[#C9A96E] text-white rounded-full flex items-center gap-1.5">
                <Zap size={10} /> Intensity {intensity.sort().join(', ')}
                <button onClick={() => setIntensity([])}><X size={10} /></button>
              </span>
            )}
            {hideOutOfStock && (
              <span className="text-xs px-3 py-1 bg-[#8B7D72] text-white rounded-full flex items-center gap-1.5">
                Tersedia saja <button onClick={() => setHideOutOfStock(false)}><X size={10} /></button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-[#C9A96E] hover:underline ml-2">
              Reset semua
            </button>
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Produk tidak ditemukan</h3>
            <p className="text-sm text-[#8B7D72] mb-6">Coba ubah filter atau kata kunci pencarian</p>
            <button onClick={resetFilters} className="px-5 py-2 bg-[#C9A96E] text-white rounded-full text-sm hover:bg-[#B8966A] transition-colors">
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}