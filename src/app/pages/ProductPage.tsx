import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { DecantVariant } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { AromaExperience } from '../components/AromaExperience';
import { DecantSuggestion } from '../components/DecantSuggestion';
import { loadQuizConfig } from '../data/quizConfig';

const categoryLabel: Record<string, { label: string; color: string }> = {
  decant:   { label: 'Decant',   color: 'bg-[#EDE8DC] text-[#5C5247]'     },
  preloved: { label: 'Preloved', color: 'bg-[#3C3327]/10 text-[#3C3327]'  },
  bnib:     { label: 'BNIB',     color: 'bg-[#C9A96E]/15 text-[#8B6914]'  },
};

export function ProductPage() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<DecantVariant | null>(null);

  // Load scent labels from Quiz Settings (single source of truth)
  const scentLabel = useMemo(() => {
    const cfg = loadQuizConfig();
    const labels: Record<string, string> = {};
    cfg.scentTypes.forEach(s => {
      labels[s.id] = s.label;
    });
    return labels;
  }, []);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8B7D72] mb-4">Produk tidak ditemukan</p>
          <Link to="/catalog" className="text-[#C9A96E] hover:underline">Kembali ke Katalog</Link>
        </div>
      </div>
    );
  }

  // Resolve active variant (decant multi-size)
  const hasVariants = product.category === 'decant' && product.variants && product.variants.length > 0;
  const activeVariant = hasVariants
    ? (selectedVariant ?? product.variants![0])
    : null;

  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayStock = activeVariant ? activeVariant.stock : product.stock;

  const cat = categoryLabel[product.category];
  const relatedProducts = products
    .filter(p => p.id !== product.id && (
      p.scentType.some(s => product.scentType.includes(s)) || p.category === product.category
    ))
    .slice(0, 4);
  const inCart = items.find(i => i.product.id === product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, price: displayPrice, stock: displayStock });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-[#8B7D72]">
          <Link to="/" className="hover:text-[#C9A96E]">Beranda</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-[#C9A96E]">Katalog</Link>
          <span>/</span>
          <span className="text-[#5C5247]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Image ──────────────────────────────────── */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5F0E8]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[product.image, product.image, product.image].map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#F5F0E8] opacity-70 cursor-pointer hover:opacity-100 transition-opacity">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Details ────────────────────────────────── */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
              {product.scentType.map(scent => (
                <span key={scent} className="text-xs px-3 py-1 rounded-full bg-[#EDE8DC] text-[#8B7D72]">
                  {scentLabel[scent] || scent}
                </span>
              ))}
            </div>

            <p className="text-xs text-[#C9A96E] tracking-widest uppercase mb-2">{product.brand}</p>

            <h1
              className="text-[#2C2520] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 400, lineHeight: 1.2 }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-semibold text-[#2C2520]">
                Rp {displayPrice.toLocaleString('id-ID')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-[#8B7D72] line-through">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-sm text-red-500 font-medium">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* ── Decant variant picker ─────────────────── */}
            {hasVariants && (
              <div className="mb-5">
                <div className="text-xs text-[#8B7D72] uppercase tracking-widest mb-2">Pilih Ukuran</div>
                <div className="flex gap-2 flex-wrap">
                  {product.variants!.map(v => {
                    const isActive = (activeVariant?.size === v.size);
                    return (
                      <button
                        key={v.size}
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock === 0}
                        className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                          isActive
                            ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#2C2520]'
                            : v.stock === 0
                            ? 'border-[#E0D8CC] text-[#C0B8B0] cursor-not-allowed line-through'
                            : 'border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'
                        }`}
                      >
                        <span>{v.size}</span>
                        <span className="block text-xs text-[#C9A96E] mt-0.5">
                          Rp {v.price.toLocaleString('id-ID')}
                        </span>
                        {v.stock === 0 && (
                          <span className="block text-[9px] text-red-400">Habis</span>
                        )}
                        {v.stock > 0 && (
                          <span className="block text-[9px] text-[#8B7D72]">{v.stock} tersisa</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.size && !hasVariants && (
                <span className="text-xs text-[#5C5247] bg-[#EDE8DC] px-3 py-1.5 rounded-lg">{product.size}</span>
              )}
              {product.condition && (
                <span className="text-xs text-[#5C5247] bg-[#EDE8DC] px-3 py-1.5 rounded-lg">
                  Kondisi: {product.condition}
                </span>
              )}
              <span className={`text-xs px-3 py-1.5 rounded-lg ${displayStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                {displayStock > 0 ? `Stok: ${displayStock}` : 'Stok Habis'}
              </span>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h3 className="text-sm font-medium text-[#2C2520] mb-2">Deskripsi</h3>
              <p className="text-sm text-[#5C5247] leading-relaxed">{product.description}</p>
            </div>

            {/* ── Decant Suggestion (for BNIB / Preloved) ── */}
            <DecantSuggestion product={product} />

            {/* ── Aroma Experience Visual ──────────────── */}
            <AromaExperience product={product} />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={displayStock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm transition-all ${
                  added
                    ? 'bg-green-600 text-white'
                    : displayStock === 0
                    ? 'bg-[#E0D8CC] text-[#8B7D72] cursor-not-allowed'
                    : 'bg-[#2C2520] text-white hover:bg-[#C9A96E]'
                }`}
              >
                {added ? 'Ditambahkan!' : hasVariants ? `Tambah ${activeVariant?.size ?? ''} ke Keranjang` : 'Tambah ke Keranjang'}
              </button>
              {inCart && (
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 py-3.5 px-6 rounded-full text-sm border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  Lihat Keranjang ({inCart.qty})
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-6 border-t border-[#E0D8CC]">
              {['Original & Terjamin', 'Pengiriman Aman', 'Order via WhatsApp'].map(badge => (
                <span key={badge} className="text-xs text-[#8B7D72]">{badge}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-[#C9A96E]" />
              <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400 }}>
                Produk Serupa
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}