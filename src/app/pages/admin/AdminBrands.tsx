import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { BRANDS as INITIAL, Brand } from '../../data/brands';

export function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', country: '', description: '' });

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', country: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm({ name: b.name, country: b.country, description: b.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setBrands(prev => prev.map(b => b.id === editing.id ? { ...b, ...form } : b));
    } else {
      setBrands(prev => [...prev, { id: 'b' + Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    setDeleteId(null);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem' }}>Kelola Brand</h1>
          <p className="text-sm text-[#8B7D72] mt-0.5">{brands.length} brand terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8966A] transition-colors"
        >
          <Plus size={16} /> Tambah Brand
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7D72]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari brand..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F0E8] border-b border-[#E0D8CC]">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-[#8B7D72] uppercase tracking-wide">Nama Brand</th>
              <th className="text-left px-4 py-3 text-xs text-[#8B7D72] uppercase tracking-wide hidden sm:table-cell">Negara</th>
              <th className="text-left px-4 py-3 text-xs text-[#8B7D72] uppercase tracking-wide hidden lg:table-cell">Deskripsi</th>
              <th className="text-left px-4 py-3 text-xs text-[#8B7D72] uppercase tracking-wide">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE1]">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-[#FAF8F4] transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-[#2C2520]">{b.name}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs px-2 py-1 bg-[#EDE8DC] text-[#5C5247] rounded-full">{b.country}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-[#8B7D72] line-clamp-1">{b.description}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1.5 text-[#8B7D72] hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="p-1.5 text-[#8B7D72] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[#8B7D72]">Brand tidak ditemukan</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b border-[#F0EBE1] px-6 py-4 flex items-center justify-between">
              <h2 className="font-medium text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                {editing ? 'Edit Brand' : 'Tambah Brand'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#8B7D72] hover:text-[#2C2520]">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Nama Brand *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nama brand"
                  className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Negara Asal</label>
                <input
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  placeholder="mis. Prancis, Italia"
                  className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Deskripsi singkat brand"
                  className="w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4] resize-none"
                />
              </div>
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
            <h3 className="font-medium text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>Hapus Brand?</h3>
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
