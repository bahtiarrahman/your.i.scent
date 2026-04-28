import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { loadQuizConfig } from '../data/quizConfig';

const categoryLabel: Record<string, { label: string; color: string }> = {
  decant:   { label: 'Decant',   color: 'bg-[#EDE8DC] text-[#5C5247]'    },
  preloved: { label: 'Preloved', color: 'bg-[#3C3327]/10 text-[#3C3327]' },
  bnib:     { label: 'BNIB',     color: 'bg-[#C9A96E]/15 text-[#8B6914]' },
};

interface Props { product: Product; }

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [flash, setFlash] = useState<'added' | 'full' | null>(null);

  // Load scent labels from Quiz Settings (single source of truth)
  const scentLabel = useMemo(() => {
    const cfg = loadQuizConfig();
    const labels: Record<string, string> = {};
    cfg.scentTypes.forEach(s => {
      labels[s.id] = s.label;
    });
    return labels;
  }, []);

  const cat = categoryLabel[product.category];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const hasVariants = product.category === 'decant' && product.variants && product.variants.length > 0;
  const quickVariant = hasVariants ? product.variants![0] : null;
  const displayPrice = quickVariant ? quickVariant.price : product.price;

  // Stok efektif untuk quick-add (variant pertama atau stok utama)
  const effectiveStock = quickVariant ? quickVariant.stock : product.stock;
  const isHabis = effectiveStock === 0;
  const isHampirHabis = !isHabis && effectiveStock <= 3;

  const handleAdd = () => {
    if (isHabis) return;
    const ok = addToCart({ ...product, price: displayPrice, stock: effectiveStock });
    if (ok) {
      setFlash('added');
    } else {
      setFlash('full');
    }
    setTimeout(() => setFlash(null), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#F0EBE1] flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#F5F0E8]">
        <img
          src={product.image} alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isHabis ? 'opacity-50 grayscale' : ''}`}
          loading="lazy"
        />
        {/* Stok Habis overlay */}
        {isHabis && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full tracking-wider">
              Stok Habis
            </span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cat.color}`} style={{ fontFamily: "'Inter', sans-serif" }}>
            {cat.label}
          </span>
          {discount && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              -{discount}%
            </span>
          )}
          {isHampirHabis && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Sisa {effectiveStock}
            </span>
          )}
          {hasVariants && !isHabis && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2C2520]/80 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              {product.variants!.map(v => v.size).join(' · ')}
            </span>
          )}
        </div>
        {/* Hover overlay */}
        <Link to={`/product/${product.id}`} className="absolute inset-0 bg-[#2C2520]/0 group-hover:bg-[#2C2520]/15 transition-colors duration-300" aria-label={`Lihat ${product.name}`} />
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-[10px] text-[#C9A96E] uppercase tracking-widest mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          {product.brand}
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {product.scentType.map(scent => (
            <span key={scent} className="text-[9px] px-2 py-0.5 rounded-full bg-[#EDE8DC] text-[#8B7D72]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {scentLabel[scent]}
            </span>
          ))}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-[#2C2520] line-clamp-2 hover:text-[#C9A96E] transition-colors leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>
            {product.name}
          </h3>
        </Link>

        {product.size && !hasVariants && (
          <p className="text-[10px] text-[#8B7D72] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{product.size}</p>
        )}
        {product.condition && (
          <p className="text-[10px] text-[#8B7D72] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{product.condition}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#8B7D72] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              {hasVariants ? 'Mulai dari' : ''}
            </div>
            <div className={`text-base font-semibold ${isHabis ? 'text-[#8B7D72]' : 'text-[#2C2520]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Rp {displayPrice.toLocaleString('id-ID')}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-[#8B7D72] line-through" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={isHabis}
            className={`text-xs px-3 py-2 rounded-lg transition-colors disabled:cursor-not-allowed ${
              isHabis
                ? 'bg-[#E0D8CC] text-[#8B7D72]'
                : flash === 'added'
                ? 'bg-green-600 text-white'
                : flash === 'full'
                ? 'bg-orange-400 text-white'
                : 'bg-[#2C2520] text-white hover:bg-[#C9A96E]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {isHabis
              ? 'Habis'
              : flash === 'added'
              ? '✓ Ditambah'
              : flash === 'full'
              ? 'Maks stok'
              : hasVariants ? `+ ${quickVariant!.size}` : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}