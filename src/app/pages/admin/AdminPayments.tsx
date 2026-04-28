import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, CreditCard, Smartphone, QrCode, Building2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'ewallet' | 'qris';
  name: string;
  accountNumber: string;
  accountName: string;
  instructions: string;
  active: boolean;
}

const INITIAL_PAYMENTS: PaymentMethod[] = [
  { id: 'pm1', type: 'bank', name: 'BCA', accountNumber: '1234567890', accountName: 'Your.i Scent', instructions: 'Transfer ke nomor rekening BCA 1234567890 a.n. Your.i Scent', active: true },
  { id: 'pm2', type: 'bank', name: 'Mandiri', accountNumber: '0987654321', accountName: 'Your.i Scent', instructions: 'Transfer ke nomor rekening Mandiri 0987654321 a.n. Your.i Scent', active: true },
  { id: 'pm3', type: 'ewallet', name: 'GoPay', accountNumber: '081234567890', accountName: 'Your.i Scent', instructions: 'Transfer ke GoPay 081234567890. Screenshot bukti transfer lalu kirim ke WhatsApp.', active: true },
  { id: 'pm4', type: 'ewallet', name: 'OVO', accountNumber: '081234567890', accountName: 'Your.i Scent', instructions: 'Transfer ke OVO 081234567890. Screenshot bukti transfer lalu kirim ke WhatsApp.', active: false },
  { id: 'pm5', type: 'qris', name: 'QRIS', accountNumber: '-', accountName: 'Your.i Scent', instructions: 'QR code akan dikirim melalui WhatsApp setelah order dikonfirmasi.', active: true },
];

const typeIcon = { bank: Building2, ewallet: Smartphone, qris: QrCode };
const typeLabel = { bank: 'Bank Transfer', ewallet: 'E-Wallet', qris: 'QRIS' };
const typeColor = { bank: 'bg-blue-50 text-blue-600', ewallet: 'bg-green-50 text-green-600', qris: 'bg-purple-50 text-purple-600' };

const emptyForm = { type: 'bank' as const, name: '', accountNumber: '', accountName: '', instructions: '', active: true };

export function AdminPayments() {
  const [payments, setPayments] = useState<PaymentMethod[]>(INITIAL_PAYMENTS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: PaymentMethod) => {
    setEditing(p);
    setForm({ type: p.type, name: p.name, accountNumber: p.accountNumber, accountName: p.accountName, instructions: p.instructions, active: p.active });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setPayments(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      setPayments(prev => [...prev, { id: 'pm' + Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
  };

  const toggleActive = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem' }}>Kelola Pembayaran</h1>
          <p className="text-sm text-[#8B7D72] mt-0.5">{payments.filter(p => p.active).length} metode aktif</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8966A] transition-colors"
        >
          <Plus size={16} /> Tambah Metode
        </button>
      </div>

      {/* Methods grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.map(pm => {
          const Icon = typeIcon[pm.type];
          return (
            <div key={pm.id} className={`bg-white rounded-2xl border ${pm.active ? 'border-[#E0D8CC]' : 'border-[#E0D8CC] opacity-60'} p-5`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColor[pm.type]}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-[#2C2520] text-sm">{pm.name}</div>
                    <div className="text-[10px] text-[#8B7D72] uppercase tracking-wide">{typeLabel[pm.type]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleActive(pm.id)}
                    className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                      pm.active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-[#F5F0E8] text-[#8B7D72] hover:bg-[#EDE8DC]'
                    }`}
                  >
                    {pm.active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>

              {pm.type !== 'qris' && (
                <div className="mb-3 bg-[#F5F0E8] rounded-xl p-3">
                  <div className="text-[10px] text-[#8B7D72] mb-1">No. Rekening / Akun</div>
                  <div className="text-sm font-medium text-[#2C2520] font-mono">{pm.accountNumber}</div>
                  <div className="text-xs text-[#5C5247]">a.n. {pm.accountName}</div>
                </div>
              )}

              <p className="text-xs text-[#8B7D72] leading-relaxed mb-4">{pm.instructions}</p>

              <div className="flex gap-2 pt-3 border-t border-[#F0EBE1]">
                <button
                  onClick={() => openEdit(pm)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-[#5C5247] border border-[#E0D8CC] rounded-lg hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(pm.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-[#8B7D72] border border-[#E0D8CC] rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b border-[#F0EBE1] px-6 py-4 flex items-center justify-between">
              <h2 className="font-medium text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                {editing ? 'Edit Metode' : 'Tambah Metode Pembayaran'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#8B7D72] hover:text-[#2C2520]">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Tipe Pembayaran</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]">
                  <option value="bank">Bank Transfer</option>
                  <option value="ewallet">E-Wallet</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Nama *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="mis. BCA, GoPay, QRIS" className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]" />
              </div>
              {form.type !== 'qris' && (
                <>
                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Nomor Rekening / Akun</label>
                    <input value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))}
                      placeholder="Nomor rekening atau nomor HP" className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Nama Pemilik</label>
                    <input value={form.accountName} onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
                      placeholder="Nama pemilik akun" className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]" />
                  </div>
                </>
              )}
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Instruksi Pembayaran</label>
                <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                  rows={3} placeholder="Instruksi untuk pelanggan..." className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4] resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-[#C9A96E]" />
                <span className="text-sm text-[#5C5247]">Aktifkan metode ini</span>
              </label>
            </div>
            <div className="border-t border-[#F0EBE1] px-6 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#E0D8CC] text-[#5C5247] rounded-lg text-sm">Batal</button>
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8966A] transition-colors">
                <Save size={15} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-medium text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>Hapus Metode Pembayaran?</h3>
            <p className="text-sm text-[#5C5247] mb-5">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#E0D8CC] text-[#5C5247] rounded-lg text-sm">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
