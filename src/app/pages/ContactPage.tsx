import React, { useState } from 'react';
import { MessageCircle, Instagram, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleWA = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Halo *your.i scent* 👋\n\nNama: ${form.name}\n\n${form.message}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#2C2520] py-16 text-center px-4">
        <div className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-3">Hubungi Kami</div>
        <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300 }}>Kontak & Lokasi</h1>
        <p className="text-[#8B7D72] mt-2 text-sm">Kami siap membantu kamu menemukan parfum yang tepat</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[#2C2520] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400 }}>
                Cara Menghubungi Kami
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: MessageCircle,
                    title: 'WhatsApp',
                    sub: '+62 812 3456 7890',
                    detail: 'Cara tercepat untuk order dan konsultasi parfum',
                    href: 'https://wa.me/6281234567890',
                    color: 'bg-green-50 text-green-600',
                    label: 'Chat Sekarang',
                  },
                  {
                    icon: Instagram,
                    title: 'Instagram',
                    sub: '@your.i_scent',
                    detail: 'Follow untuk update produk terbaru dan tips parfum',
                    href: 'https://instagram.com/your.i_scent',
                    color: 'bg-pink-50 text-pink-600',
                    label: 'Follow Kami',
                  },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-2xl border border-[#F0EBE1] p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#2C2520] text-sm">{item.title}</div>
                      <div className="text-[#C9A96E] text-sm">{item.sub}</div>
                      <p className="text-xs text-[#8B7D72] mt-1">{item.detail}</p>
                    </div>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 bg-[#2C2520] text-white rounded-lg hover:bg-[#C9A96E] transition-colors flex-shrink-0"
                    >
                      {item.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#F0EBE1] p-5">
                <MapPin size={20} className="text-[#C9A96E] mb-3" />
                <h3 className="font-medium text-[#2C2520] text-sm mb-1">Lokasi</h3>
                <p className="text-xs text-[#5C5247] leading-relaxed">
                  Embung Tambak Boyo, Sleman, DIY<br />
                  (Pengiriman ke seluruh Indonesia via JNE, J&T, SiCepat)
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#F0EBE1] p-5">
                <Clock size={20} className="text-[#C9A96E] mb-3" />
                <h3 className="font-medium text-[#2C2520] text-sm mb-1">Jam Operasional</h3>
                <div className="text-xs text-[#5C5247] space-y-1">
                  <div className="flex justify-between">
                    <span>Senin – Minggu</span>
                    <span>16.30 – 18.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sabtu – Minggu</span>
                    <span>06.00 – 09.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-[#EDE8DC] rounded-2xl overflow-hidden h-48 flex items-center justify-center border border-[#E0D8CC]">
              <div className="text-center">
                <MapPin size={32} className="text-[#C9A96E] mx-auto mb-2" />
                <p className="text-sm text-[#5C5247]">Embung Tambak Boyo, Sleman, DIY</p>
                <a
                  href="https://share.google/DPVlGH92hJeglS9U0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C9A96E] hover:underline mt-1 block"
                >
                  Buka di Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-[#2C2520] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400 }}>
              Kirim Pesan
            </h2>
            <form onSubmit={handleWA} className="bg-white rounded-2xl border border-[#F0EBE1] p-6 space-y-5">
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Nama Kamu</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Masukkan namamu"
                  className="w-full px-4 py-2.5 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Pesan</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={6}
                  placeholder="Tanyakan soal parfum, stok, atau apa saja..."
                  className="w-full px-4 py-2.5 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4] resize-none"
                />
              </div>
              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm transition-all ${
                  sent
                    ? 'bg-green-600 text-white'
                    : 'bg-[#2C2520] text-white hover:bg-[#C9A96E]'
                }`}
              >
                {sent ? (
                  <><CheckCircle size={16} /> Pesan Terkirim!</>
                ) : (
                  <><MessageCircle size={16} /> Kirim via WhatsApp</>
                )}
              </button>
              <p className="text-xs text-center text-[#8B7D72]">
                Pesan akan diteruskan langsung ke WhatsApp kami
              </p>
            </form>

            {/* FAQ */}
            <div className="mt-8">
              <h3 className="text-[#2C2520] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>Pertanyaan Umum</h3>
              <div className="space-y-3">
                {[
                  { q: 'Berapa lama proses pengiriman?', a: 'Biasanya 1–3 hari kerja via JNE/J&T/SiCepat tergantung lokasi tujuan.' },
                  { q: 'Apakah parfum 100% original?', a: 'Ya! Semua produk kami terjamin keasliannya. Kami cek batch code setiap produk.' },
                  { q: 'Bisa request parfum tertentu?', a: 'Bisa! Hubungi kami via WhatsApp, kami akan bantu cari parfum yang kamu inginkan.' },
                ].map(faq => (
                  <div key={faq.q} className="bg-[#F5F0E8] rounded-xl p-4">
                    <div className="text-sm font-medium text-[#2C2520] mb-1">{faq.q}</div>
                    <p className="text-xs text-[#5C5247] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
