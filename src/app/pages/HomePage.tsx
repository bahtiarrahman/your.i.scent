import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

const HERO_IMG = 'https://images.unsplash.com/photo-1511697240908-307469fb1a88?w=1400&q=80';
const ABOUT_IMG = 'https://images.unsplash.com/photo-1775210727581-1fda6b9f1170?w=800&q=80';

const categories = [
  {
    id: 'decant',
    title: 'Decant',
    subtitle: 'Coba sebelum beli',
    desc: 'Parfum sample 2ml, 5ml, dan 10ml dari botol original. Hemat, terpercaya, bebas eksplorasi.',
    color: 'bg-[#EDE8DC]',
  },
  {
    id: 'preloved',
    title: 'Preloved',
    subtitle: 'Parfum bekas pilihan',
    desc: 'Parfum bekas berkualitas tinggi dengan kondisi terawat dan batch code valid.',
    color: 'bg-[#3C3327]/8',
  },
  {
    id: 'bnib',
    title: 'BNIB',
    subtitle: 'Brand New In Box',
    desc: 'Parfum baru original, tersegel sempurna. Jaminan keaslian 100%.',
    color: 'bg-[#C9A96E]/10',
  },
];

const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 8);

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF8F4]">
      {/* HERO */}
      <section className="relative h-[90vh] min-h-[550px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2520]/85 via-[#2C2520]/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                Parfum Original Terpercaya
              </span>
            </div>
            <h1 className="text-white mb-4 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, lineHeight: 1.15 }}>
              Temukan Aroma<br />
              <em>Khasmu</em>
            </h1>
            <p className="text-[#D0C8BC] mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem' }}>
              Coba decant, temukan parfum terbaikmu. Koleksi lengkap decant, preloved, dan BNIB — semua original, semua terpercaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] text-white rounded-full hover:bg-[#B8966A] transition-colors text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Jelajahi Produk
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Mulai Fragrance Quiz
              </Link>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <div className="w-px h-8 bg-white animate-pulse" />
          <span className="text-white text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Scroll</span>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#2C2520] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { val: '50+', label: 'Produk Tersedia' },
              { val: '100%', label: 'Original & Terpercaya' },
              { val: '3 Hari', label: 'Estimasi Pengiriman' },
              { val: '300+', label: 'Pelanggan Puas' },
            ].map(stat => (
              <div key={stat.val} className="text-center">
                <div className="text-[#C9A96E] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem' }}>{stat.val}</div>
                <div className="text-[#8B7D72] text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Koleksi Kami</div>
          <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>
            Pilih Kategorimu
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/catalog?cat=${cat.id}`}
              className={`group relative rounded-2xl p-8 ${cat.color} hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#C9A96E]/30`}
            >
              <div className="text-[#C9A96E]/40 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, lineHeight: 1 }}>
                0{idx + 1}
              </div>
              <div className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{cat.subtitle}</div>
              <h3 className="text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400 }}>{cat.title}</h3>
              <p className="text-sm text-[#5C5247] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{cat.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#C9A96E] group-hover:gap-3 transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
                Lihat Koleksi <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Pilihan Terbaik</div>
              <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>
                Produk Unggulan
              </h2>
            </div>
            <Link
              to="/catalog"
              className="hidden sm:flex items-center gap-2 text-sm text-[#C9A96E] hover:text-[#B8966A] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm text-[#C9A96E]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* QUIZ BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#2C2520] rounded-3xl overflow-hidden grid md:grid-cols-2">
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Fitur Eksklusif</div>
            <h2 className="text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, lineHeight: 1.2 }}>
              Bingung Pilih Parfum?<br />Coba <em>Quiz Aroma</em>
            </h2>
            <p className="text-[#8B7D72] mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
              Jawab beberapa pertanyaan tentang preferensi dan gaya hidupmu, dan kami akan merekomendasikan parfum yang paling sesuai untukmu.
            </p>
            <Link
              to="/quiz"
              className="self-start inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] text-white rounded-full hover:bg-[#B8966A] transition-colors text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Mulai Quiz Sekarang
            </Link>
          </div>
          <div className="hidden md:block relative">
            <img src={ABOUT_IMG} alt="Quiz" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#2C2520]/50" />
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="py-16 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Mengapa Kami</div>
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>
              Keunggulan your.i scent
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '100% Original', desc: 'Semua produk terjamin keasliannya dengan batch code yang bisa dicek.' },
              { title: 'Terpercaya', desc: 'Lebih dari 300 pelanggan puas dengan review bintang 5.' },
              { title: 'Coba Dulu', desc: 'Tersedia decant untuk kamu eksplorasi sebelum membeli full bottle.' },
              { title: 'Transparan', desc: 'Deskripsi kondisi produk yang jujur dan detail untuk setiap item.' },
            ].map((item, idx) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#F0EBE1] hover:shadow-md transition-shadow">
                <div className="text-[#C9A96E]/50 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300 }}>
                  0{idx + 1}
                </div>
                <h3 className="text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>{item.title}</h3>
                <p className="text-xs text-[#8B7D72] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}