import React from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product; // the BNIB or Preloved being viewed
}

export function DecantSuggestion({ product }: Props) {
  if (product.category === 'decant') return null;

  // 1. Try same brand first
  let decants = PRODUCTS.filter(
    p => p.category === 'decant' && p.brandId === product.brandId
  );

  // 2. Fall back: same scent type (overlap antara scent types)
  if (decants.length === 0) {
    decants = PRODUCTS.filter(
      p => p.category === 'decant' && p.scentType.some(s => product.scentType.includes(s))
    );
  }

  if (decants.length === 0) return null;

  const cheapest = decants.sort((a, b) => a.price - b.price)[0];
  const smallestVariant = cheapest.variants?.[0];
  const trialPrice = smallestVariant ? smallestVariant.price : cheapest.price;
  const trialSize  = smallestVariant ? smallestVariant.size  : cheapest.size ?? '5ml';
  const savings    = product.price - trialPrice;
  const isSameBrand = cheapest.brandId === product.brandId;

  const { addToCart } = useCart();

  return (
    <div
      className="rounded-2xl border border-[#C9A96E]/30 bg-gradient-to-br from-[#FBF5E8] to-[#FAF8F4] p-5 mb-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-px bg-[#C9A96E]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E]">
          Try First System
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p
            className="text-[#2C2520] mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 400 }}
          >
            Belum yakin? Coba decant dulu.
          </p>
          <p className="text-xs text-[#5C5247] leading-relaxed">
            {isSameBrand
              ? `Tersedia decant ${cheapest.brand} · ${cheapest.name} ukuran ${trialSize}`
              : `Aroma serupa tersedia dalam decant ${trialSize}`}
            {' '}mulai{' '}
            <strong className="text-[#C9A96E]">Rp {trialPrice.toLocaleString('id-ID')}</strong>
            {' '}— hemat{' '}
            <strong className="text-[#2C2520]">
              Rp {savings.toLocaleString('id-ID')}
            </strong>{' '}
            jika tidak cocok.
          </p>
        </div>

        <div className="flex gap-2 sm:flex-col sm:items-stretch">
          <button
            onClick={() => addToCart({ ...cheapest, price: trialPrice, stock: smallestVariant?.stock ?? cheapest.stock })}
            className="flex-1 sm:flex-none text-xs px-4 py-2 bg-[#2C2520] text-white rounded-full hover:bg-[#C9A96E] transition-colors whitespace-nowrap"
          >
            + Decant {trialSize}
          </button>
          <Link
            to={`/product/${cheapest.id}`}
            className="flex-1 sm:flex-none text-xs px-4 py-2 border border-[#C9A96E] text-[#C9A96E] rounded-full hover:bg-[#C9A96E] hover:text-white transition-colors whitespace-nowrap text-center flex items-center justify-center gap-1"
          >
            Lihat <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Other decants of same brand */}
      {decants.length > 1 && (
        <div className="mt-4 pt-4 border-t border-[#E0D8CC]">
          <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">
            Decant lain yang tersedia
          </div>
          <div className="flex flex-wrap gap-2">
            {decants.slice(0, 4).map(d => (
              <Link
                key={d.id}
                to={`/product/${d.id}`}
                className="text-xs px-3 py-1 bg-white border border-[#E0D8CC] rounded-full text-[#5C5247] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
              >
                {d.name} · mulai Rp {d.price.toLocaleString('id-ID')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
