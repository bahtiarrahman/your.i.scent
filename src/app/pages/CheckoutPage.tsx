import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, ArrowLeft, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateOrderId } from '../data/orders';
import type { OrderCategory } from '../data/orders';

const WA_NUMBER = '6281234567890';

// ─── Flat rate per zona ───────────────────────────────────────────────────────
const SHIPPING_ZONES = [
  { id: 'jabodetabek',  label: 'Jabodetabek',                    sub: 'Jakarta, Bogor, Depok, Tangerang, Bekasi',          price: 12000 },
  { id: 'jawa',         label: 'Pulau Jawa',                     sub: 'Bandung, Surabaya, Yogyakarta, Semarang, dll',      price: 18000 },
  { id: 'sumatra',      label: 'Sumatera',                       sub: 'Medan, Palembang, Pekanbaru, Padang, Lampung, dll', price: 28000 },
  { id: 'bali_nusa',    label: 'Bali & Nusa Tenggara',           sub: 'Denpasar, Mataram, Kupang, dll',                   price: 28000 },
  { id: 'kalimantan',   label: 'Kalimantan',                     sub: 'Balikpapan, Banjarmasin, Pontianak, Samarinda, dll',price: 32000 },
  { id: 'sulawesi',     label: 'Sulawesi',                       sub: 'Makassar, Manado, Palu, Kendari, dll',              price: 35000 },
  { id: 'maluku_papua', label: 'Maluku & Papua',                 sub: 'Ambon, Jayapura, Sorong, Ternate, dll',             price: 50000 },
];

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    zone: '',
    note: '',
    payment: 'transfer_bca',
  });

  const [zoneOpen, setZoneOpen] = useState(false);

  const selectedZone = SHIPPING_ZONES.find(z => z.id === form.zone) ?? null;
  const shipping     = selectedZone?.price ?? 0;
  const grandTotal   = totalPrice + shipping;

  const paymentOptions = [
    { id: 'transfer_bca',     label: 'Transfer BCA',     sub: '1234567890 a.n. Your.i Scent' },
    { id: 'transfer_mandiri', label: 'Transfer Mandiri', sub: '0987654321 a.n. Your.i Scent' },
    { id: 'gopay',            label: 'GoPay / OVO',      sub: '+62 812-3456-7890' },
    { id: 'qris',             label: 'QRIS',             sub: 'Scan QR saat konfirmasi' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !selectedZone) return;

    const paymentLabel = paymentOptions.find(p => p.id === form.payment)?.label || form.payment;

    const draftItems = items.map(i => ({
      category: i.product.category as OrderCategory,
      size: i.product.variants?.[0]?.size ?? undefined,
    }));
    const refId = generateOrderId(draftItems);

    const itemsText = items
      .map(i => `  - ${i.product.name} (${i.product.brand}) ×${i.qty} = ${rp(i.product.price * i.qty)}`)
      .join('\n');

    const message =
      `Halo *your.i scent* 👋\n\n` +
      `📋 *Ref:* \`${refId}\`\n\n` +
      `Saya ingin memesan:\n\n${itemsText}\n\n` +
      `---\n` +
      `💰 *Subtotal:* ${rp(totalPrice)}\n` +
      `🚚 *Ongkir (${selectedZone.label}):* ${rp(shipping)}\n` +
      `✅ *TOTAL:* ${rp(grandTotal)}\n\n` +
      `---\n` +
      `👤 *Nama:* ${form.name}\n` +
      `📱 *No. HP:* ${form.phone}\n` +
      `🏠 *Alamat:* ${form.address}\n` +
      `💳 *Pembayaran:* ${paymentLabel}` +
      (form.note ? `\n📝 *Catatan:* ${form.note}` : '') +
      `\n\nMohon konfirmasi ketersediaan stok ya kak. Terima kasih! 🌸`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8B7D72] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Keranjang kosong</p>
          <button onClick={() => navigate('/catalog')} className="text-[#C9A96E] hover:underline text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#2C2520] py-12 text-center">
        <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300 }}>
          Checkout
        </h1>
        <p className="text-[#8B7D72] text-sm mt-1">Isi data pengiriman & lanjutkan via WhatsApp</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-sm text-[#8B7D72] hover:text-[#2C2520] mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Keranjang
        </button>

        <form onSubmit={handleOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Form kiri ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Data Pengiriman */}
              <div className="bg-white rounded-2xl border border-[#F0EBE1] p-6">
                <h2 className="text-[#2C2520] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                  Data Pengiriman
                </h2>
                <div className="space-y-4">

                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Nama Lengkap *</label>
                    <input required type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Nama lengkap penerima"
                      className="w-full px-4 py-2.5 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4]" />
                  </div>

                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Nomor HP / WhatsApp *</label>
                    <input required type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="08xx-xxxx-xxxx"
                      className="w-full px-4 py-2.5 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4]" />
                  </div>

                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Alamat Lengkap *</label>
                    <textarea required name="address" value={form.address} onChange={handleChange} rows={3}
                      placeholder="Jl. Contoh No.1, Kelurahan, Kecamatan, Kota, Kode Pos"
                      className="w-full px-4 py-2.5 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4] resize-none" />
                  </div>

                  {/* ── Zona Pengiriman ── */}
                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Zona Pengiriman *</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setZoneOpen(o => !o)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm text-left transition-colors bg-[#FAF8F4] ${
                          selectedZone ? 'border-[#C9A96E] text-[#2C2520]' : 'border-[#E0D8CC] text-[#8B7D72]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className={selectedZone ? 'text-[#C9A96E]' : 'text-[#8B7D72]'} />
                          {selectedZone
                            ? <span>{selectedZone.label} <span className="text-[#C9A96E]">— {rp(selectedZone.price)}</span></span>
                            : 'Pilih zona pengiriman'}
                        </span>
                        <ChevronDown size={15} className={`transition-transform ${zoneOpen ? 'rotate-180' : ''} text-[#8B7D72]`} />
                      </button>

                      {zoneOpen && (
                        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#E0D8CC] rounded-xl shadow-lg overflow-hidden">
                          {SHIPPING_ZONES.map(z => (
                            <button
                              key={z.id}
                              type="button"
                              onClick={() => { setForm(f => ({ ...f, zone: z.id })); setZoneOpen(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#FAF8F4] transition-colors ${
                                form.zone === z.id ? 'bg-[#C9A96E]/5' : ''
                              }`}
                            >
                              <div>
                                <div className={`text-sm ${form.zone === z.id ? 'text-[#C9A96E]' : 'text-[#2C2520]'}`}>
                                  {z.label}
                                </div>
                                <div className="text-[11px] text-[#8B7D72] mt-0.5">{z.sub}</div>
                              </div>
                              <div className={`text-sm ml-4 whitespace-nowrap ${form.zone === z.id ? 'text-[#C9A96E]' : 'text-[#5C5247]'}`}>
                                {rp(z.price)}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8B7D72] mt-1.5">
                      Harga ongkir sudah termasuk biaya pengemasan aman untuk parfum. Dikirim via J&T / JNE / SiCepat.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Catatan (opsional)</label>
                    <textarea name="note" value={form.note} onChange={handleChange} rows={2}
                      placeholder="Contoh: Tolong bungkus rapi, ini untuk hadiah"
                      className="w-full px-4 py-2.5 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4] resize-none" />
                  </div>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="bg-white rounded-2xl border border-[#F0EBE1] p-6">
                <h2 className="text-[#2C2520] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                  Metode Pembayaran
                </h2>
                <div className="space-y-3">
                  {paymentOptions.map(opt => (
                    <label key={opt.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        form.payment === opt.id ? 'border-[#C9A96E] bg-[#C9A96E]/5' : 'border-[#E0D8CC] hover:border-[#C9A96E]/50'
                      }`}>
                      <input type="radio" name="payment" value={opt.id}
                        checked={form.payment === opt.id} onChange={handleChange}
                        className="accent-[#C9A96E]" />
                      <div>
                        <div className="text-sm text-[#2C2520]">{opt.label}</div>
                        <div className="text-xs text-[#8B7D72]">{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-[#8B7D72] mt-3 bg-[#F5F0E8] rounded-lg p-3">
                  Detail rekening/QRIS akan dikonfirmasi via WhatsApp setelah pesanan masuk.
                </p>
              </div>
            </div>

            {/* ── Ringkasan kanan ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#F0EBE1] p-6 sticky top-24">
                <h2 className="text-[#2C2520] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                  Ringkasan
                </h2>

                {/* Item list */}
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F0E8]">
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#2C2520] line-clamp-1">{item.product.name}</div>
                        <div className="text-[10px] text-[#8B7D72]">{item.product.brand} ×{item.qty}</div>
                        <div className="text-xs text-[#5C5247]">{rp(item.product.price * item.qty)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[#F0EBE1] pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5C5247]">Subtotal</span>
                    <span className="text-[#2C2520]">{rp(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5C5247]">Ongkir</span>
                    {selectedZone
                      ? <span className="text-[#2C2520]">{rp(shipping)}</span>
                      : <span className="text-[#8B7D72] italic text-xs">Pilih zona dulu</span>}
                  </div>
                </div>

                <div className="border-t border-[#F0EBE1] pt-3 mb-5">
                  <div className="flex justify-between text-[#2C2520]">
                    <span>Total</span>
                    <span>{selectedZone ? rp(grandTotal) : rp(totalPrice)}</span>
                  </div>
                  {selectedZone && (
                    <div className="text-[10px] text-[#8B7D72] text-right mt-0.5">
                      termasuk ongkir {selectedZone.label}
                    </div>
                  )}
                </div>

                {/* Zona reminder kalau belum dipilih */}
                {!selectedZone && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-4">
                    <p className="text-xs text-amber-700">
                      ⚠️ Pilih zona pengiriman untuk melihat total akhir.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedZone}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={16} />
                  Pesan via WhatsApp
                </button>

                <p className="text-center mt-4 text-xs text-[#8B7D72]">
                  Kamu akan diarahkan ke WhatsApp untuk konfirmasi pesanan.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
