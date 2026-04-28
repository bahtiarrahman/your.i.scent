import React from 'react';
import { Link } from 'react-router';
import { ShieldCheck, Star, FlaskConical, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const ABOUT_IMG = 'https://images.unsplash.com/photo-1775210727581-1fda6b9f1170?w=800&q=80';
const PRODUCT_IMG = 'https://images.unsplash.com/photo-1598100463653-f1fdd23143f7?w=600&q=80';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div className="bg-[#2C2520] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={ABOUT_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-3">Tentang Kami</div>
          <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300 }}>
            your.i scent
          </h1>
          <p className="text-[#8B7D72] mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Kami percaya setiap orang berhak menemukan aroma yang benar-benar mencerminkan diri mereka.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-3">Cerita Kami</div>
            <h2 className="text-[#2C2520] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, lineHeight: 1.2 }}>
              Berawal dari Kecintaan<br />pada Parfum
            </h2>
            <div className="space-y-4 text-sm text-[#5C5247] leading-relaxed">
              <p>
                <strong className="text-[#2C2520]">your.i scent</strong> lahir dari frustrasi yang kita semua pernah rasakan: membeli parfum full bottle tanpa bisa mencobanya terlebih dahulu, hanya untuk berakhir tidak cocok.
              </p>
              <p>
                Kami hadir untuk mengubah cara orang Indonesia berinteraksi dengan parfum. Dimulai dari koleksi decant kecil, kami berkembang menjadi platform yang menawarkan decant, preloved, dan BNIB — semua dengan jaminan keaslian.
              </p>
              <p>
                Karena kami percaya, menemukan parfummu sendiri adalah sebuah perjalanan yang menyenangkan. Dan kami ingin menjadi teman setia dalam perjalanan itu.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={ABOUT_IMG} alt="Toko kami" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#C9A96E] text-white rounded-2xl p-5 shadow-xl">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400 }}>300+</div>
              <div className="text-xs mt-0.5 opacity-90">Pelanggan Puas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori penjelasan */}
      <section id="how" className="py-16 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-3">Produk Kami</div>
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>
              Tiga Kategori, Satu Tujuan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FlaskConical,
                title: 'Decant',
                subtitle: 'Untuk Mencoba',
                color: 'bg-[#EDE8DC]',
                iconColor: 'text-[#5C5247]',
                desc: 'Parfum dipindahkan ke botol kecil (2ml, 5ml, 10ml) langsung dari botol original. Cara terbaik untuk mengenal aroma sebelum memutuskan membeli full bottle.',
                points: ['Dipindahkan dari botol original asli', 'Pilihan ukuran 2ml, 5ml, 10ml', 'Harga sangat terjangkau', 'Cocok untuk koleksi & traveling'],
              },
              {
                icon: Star,
                title: 'Preloved',
                subtitle: 'Bekas Berkualitas',
                color: 'bg-[#3C3327]/8',
                iconColor: 'text-[#5C5247]',
                desc: 'Parfum bekas yang dipilih ketat dengan kondisi minimal 70% isi. Semua batch code dicek validitasnya. Harga lebih hemat dari harga beli baru.',
                points: ['Kondisi terawat (70–95% isi)', 'Batch code valid dan terverifikasi', 'Harga 30–60% lebih hemat', 'Foto dan deskripsi kondisi asli'],
              },
              {
                icon: ShieldCheck,
                title: 'BNIB',
                subtitle: 'Brand New In Box',
                color: 'bg-[#C9A96E]/10',
                iconColor: 'text-[#8B6914]',
                desc: 'Parfum baru tersegel sempurna dalam box original. Jaminan 100% original dari sumber terpercaya dengan harga yang lebih kompetitif.',
                points: ['Tersegel sempurna', '100% original terjamin', 'Box dan semua kelengkapan', 'Harga kompetitif & terpercaya'],
              },
            ].map(cat => (
              <div key={cat.title} className={`${cat.color} rounded-2xl p-7`}>
                <cat.icon size={28} className={`${cat.iconColor} mb-4`} />
                <div className="text-[10px] text-[#C9A96E] uppercase tracking-widest mb-1">{cat.subtitle}</div>
                <h3 className="text-[#2C2520] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400 }}>{cat.title}</h3>
                <p className="text-sm text-[#5C5247] leading-relaxed mb-5">{cat.desc}</p>
                <ul className="space-y-2">
                  {cat.points.map(point => (
                    <li key={point} className="flex items-start gap-2 text-xs text-[#5C5247]">
                      <CheckCircle size={13} className="text-[#C9A96E] mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-3">Nilai Kami</div>
          <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>
            Komitmen Kami Padamu
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: 'Original', desc: 'Kami tidak pernah berkompromi soal keaslian. Setiap produk melewati verifikasi ketat sebelum dijual.' },
            { icon: Heart, title: 'Transparan', desc: 'Kondisi produk dijelaskan sejujurnya, lengkap dengan foto asli. Tidak ada yang disembunyikan.' },
            { icon: Star, title: 'Terpercaya', desc: 'Lebih dari 300 pelanggan mempercayai kami. Ribuan transaksi berhasil dengan kepuasan pelanggan.' },
          ].map(val => (
            <div key={val.title} className="text-center">
              <div className="w-14 h-14 bg-[#C9A96E]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <val.icon size={24} className="text-[#C9A96E]" />
              </div>
              <h3 className="text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem' }}>{val.title}</h3>
              <p className="text-sm text-[#5C5247] leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2C2520] py-16 px-4 text-center">
        <h2 className="text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300 }}>
          Siap Menemukan Aroma Khasmu?
        </h2>
        <p className="text-[#8B7D72] text-sm mb-8 max-w-md mx-auto">
          Jelajahi koleksi kami atau ikuti quiz untuk mendapatkan rekomendasi personal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A96E] text-white rounded-full text-sm hover:bg-[#B8966A] transition-colors"
          >
            Jelajahi Produk <ArrowRight size={16} />
          </Link>
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            Mulai Fragrance Quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
