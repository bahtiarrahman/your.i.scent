import React, { useState, useRef, useMemo } from 'react';
import { Link as RouterLink } from 'react-router';
import { Plus, Pencil, Trash2, X, Search, Save, Upload, FolderOpen, Link, AlertTriangle } from 'lucide-react';
import { Product, Category, ScentType, DecantVariant } from '../../data/products';
import { BRANDS } from '../../data/brands';
import { useProducts } from '../../context/ProductsContext';
import { loadQuizConfig } from '../../data/quizConfig';
import { COLOR_PRESETS, getPreset } from './quiz/Shared';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', brand: '', brandId: '', category: 'decant', price: 0,
  image: '', description: '', size: '', condition: '',
  scentType: [], notes: { top: [], middle: [], base: [] },
  intensity: 3, stock: 1, featured: false, variants: [],
};
const emptyVariant: DecantVariant = { size: '', price: 0, stock: 1 };

export function AdminProducts() {
  const { products, updateProduct, addProduct, deleteProduct } = useProducts();
  const [search, setSearch]       = useState('');

  // ─── Load scent types dari Quiz Config (SINGLE SOURCE OF TRUTH) ──────────────
  const quizConfig = useMemo(() => loadQuizConfig(), []);

  // Generate SCENT_VISUAL dinamis dari quiz config
  const SCENT_VISUAL = useMemo(() => {
    const visual: Record<string, { label: string; bg: string; border: string; text: string; dot: string }> = {};
    quizConfig.scentTypes.forEach(scent => {
      const preset = getPreset(scent.colorPreset);
      visual[scent.id] = {
        label: scent.label,
        bg: preset.bg,
        border: preset.border,
        text: preset.text,
        dot: preset.activeBg, // activeBg jadi dot color
      };
    });
    return visual;
  }, [quizConfig]);

  // List scent type IDs (untuk loop di form)
  const SCENT_TYPES = useMemo(() => quizConfig.scentTypes.map(s => s.id), [quizConfig]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [form, setForm]           = useState<Omit<Product, 'id'>>(emptyProduct);
  const [notesTop, setNotesTop]   = useState('');
  const [notesMid, setNotesMid]   = useState('');
  const [notesBase, setNotesBase] = useState('');
  const [variants, setVariants]   = useState<DecantVariant[]>([]);
  const [imagePreview, setImagePreview] = useState('');
  const [imgTab, setImgTab]       = useState<'local' | 'url' | 'upload'>('local');
  const [localFilename, setLocalFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null); setForm(emptyProduct);
    setNotesTop(''); setNotesMid(''); setNotesBase('');
    setVariants([]); setImagePreview('');
    setLocalFilename(''); setImgTab('local');
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p); setForm({ ...p });
    setNotesTop(p.notes.top.join(', '));
    setNotesMid(p.notes.middle.join(', '));
    setNotesBase(p.notes.base.join(', '));
    setVariants(p.variants ? [...p.variants] : []);
    setImagePreview(p.image);
    // Deteksi tab aktif berdasarkan tipe image
    if (p.image.startsWith('/products/')) {
      setLocalFilename(p.image.replace('/products/', ''));
      setImgTab('local');
    } else if (p.image.startsWith('data:')) {
      setLocalFilename(''); setImgTab('upload');
    } else {
      setLocalFilename(''); setImgTab('url');
    }
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setForm(f => ({ ...f, image: url }));
      setImagePreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleLocalFilename = (filename: string) => {
    setLocalFilename(filename);
    const path = filename.trim() ? `/products/${filename.trim()}` : '';
    setForm(f => ({ ...f, image: path }));
    setImagePreview(path);
  };

  const handleImageUrl = (url: string) => {
    setForm(f => ({ ...f, image: url }));
    setImagePreview(url);
  };

  const addVariant    = () => setVariants(v => [...v, { ...emptyVariant }]);
  const removeVariant = (i: number) => setVariants(v => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof DecantVariant, val: string | number) =>
    setVariants(v => v.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const notes = {
      top:    notesTop.split(',').map(s => s.trim()).filter(Boolean),
      middle: notesMid.split(',').map(s => s.trim()).filter(Boolean),
      base:   notesBase.split(',').map(s => s.trim()).filter(Boolean),
    };
    const b = BRANDS.find(b => b.id === form.brandId);
    const valid = variants.filter(v => v.size.trim());
    const basePrice = valid.length > 0 ? Math.min(...valid.map(v => v.price)) : form.price;
    const baseStock = valid.length > 0 ? valid.reduce((s, v) => s + v.stock, 0) : form.stock;
    const data: Omit<Product, 'id'> = {
      ...form, notes, brand: b?.name || form.brand,
      price: basePrice, stock: baseStock,
      variants: valid.length > 0 ? valid : undefined,
    };
    if (editing) {
      updateProduct({ ...data, id: editing.id });
    } else {
      addProduct(data);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => { deleteProduct(id); setDeleteId(null); };

  const catColor: Record<string, string> = {
    decant: 'bg-[#EDE8DC] text-[#5C5247]', preloved: 'bg-[#3C3327]/10 text-[#3C3327]', bnib: 'bg-[#C9A96E]/15 text-[#8B6914]',
  };
  const inp = 'w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm outline-none focus:border-[#C9A96E] bg-[#FAF8F4]';
  const lbl = 'text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block';

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem' }}>Kelola Produk</h1>
          <p className="text-sm text-[#8B7D72] mt-0.5">
            {products.length} produk ·{' '}
            <span className="text-red-500">{products.filter(p => p.stock === 0).length} habis</span>
            {products.filter(p => p.stock > 0 && p.stock <= 3).length > 0 && (
              <span className="text-orange-500 ml-1">· {products.filter(p => p.stock > 0 && p.stock <= 3).length} hampir habis</span>
            )}
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8966A] transition-colors">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7D72]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F0E8] border-b border-[#E0D8CC]">
              <tr>
                {['Produk', 'Brand', 'Kategori', 'Harga', 'Stok', 'Aksi'].map((h, i) => (
                  <th key={h} className={`text-left px-4 py-3 text-xs text-[#8B7D72] uppercase tracking-wide ${i === 1 ? 'hidden md:table-cell' : i === 3 ? 'hidden sm:table-cell' : i === 4 ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {filtered.map(p => {
                const isHabis = p.stock === 0;
                const isLow   = !isHabis && p.stock <= 3;
                return (
                  <tr key={p.id} className={`hover:bg-[#FAF8F4] transition-colors ${isHabis ? 'bg-red-50/40' : isLow ? 'bg-orange-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F5F0E8] flex-shrink-0">
                          <img src={p.image} alt="" className={`w-full h-full object-cover ${isHabis ? 'grayscale opacity-60' : ''}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[#2C2520] truncate max-w-[140px]">{p.name}</div>
                          <div className="flex gap-1.5 mt-0.5 flex-wrap items-center">
                            {p.featured && <span className="text-[10px] text-[#C9A96E]">Unggulan</span>}
                            {p.variants && p.variants.length > 0 && (
                              <span className="text-[10px] text-[#8B7D72]">{p.variants.map(v => v.size).join(' · ')}</span>
                            )}
                            {p.scentType.map(s => {
                              const vis = SCENT_VISUAL[s];
                              if (!vis) return null; // Skip jika scent type belum ada di config
                              return (
                                <span key={s} className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: vis.dot }} title={vis.label} />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-[#5C5247]">{p.brand}</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${catColor[p.category]}`}>{p.category.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-[#2C2520]">
                        {p.variants && p.variants.length > 0 ? `mulai Rp ${Math.min(...p.variants.map(v => v.price)).toLocaleString('id-ID')}` : `Rp ${p.price.toLocaleString('id-ID')}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1 text-sm ${isHabis ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-[#5C5247]'}`}>
                        {(isHabis || isLow) && <AlertTriangle size={11} />}
                        {isHabis ? 'Habis' : p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-[#8B7D72] hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-[#8B7D72] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-sm text-[#8B7D72]">Tidak ada produk ditemukan</div>}
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#F0EBE1] px-6 py-4 flex items-center justify-between">
              <h2 className="font-medium text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                {editing ? 'Edit Produk' : 'Tambah Produk'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#8B7D72] hover:text-[#2C2520]"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Nama */}
              <div>
                <label className={lbl}>Nama Produk *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama parfum" className={inp} />
              </div>

              {/* Brand */}
              <div>
                <label className={lbl}>Brand *</label>
                <select value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))} className={inp}>
                  <option value="">Pilih Brand</option>
                  {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              {/* Kategori */}
              <div>
                <label className={lbl}>Kategori</label>
                <div className="flex gap-2">
                  {(['decant', 'preloved', 'bnib'] as Category[]).map(cat => (
                    <button key={cat} type="button" onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-colors capitalize ${form.category === cat ? 'bg-[#2C2520] border-[#2C2520] text-white' : 'border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Jenis Aroma — MULTI SELECT visual colour pills ─────────────
                  Ini data yang dipakai quiz untuk merekomendasikan produk.
                  Quiz matching: scentType cocok = +40 poin (bobot terbesar).
                  BISA PILIH LEBIH DARI 1 (misal: Fresh + Citrus + Floral)
              ──────────────────────────────────────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={lbl + ' mb-0'}>Jenis Aroma (bisa pilih lebih dari 1)</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SCENT_TYPES.map(scent => {
                    const v = SCENT_VISUAL[scent];
                    if (!v) return null; // Skip jika visual config belum ada
                    const scentType = scent as ScentType; // Type assertion
                    const active = form.scentType.includes(scentType);
                    return (
                      <button
                        key={scent}
                        type="button"
                        onClick={() => setForm(f => ({
                          ...f,
                          scentType: active
                            ? f.scentType.filter(s => s !== scentType)
                            : [...f.scentType, scentType]
                        }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all border-2 ${
                          active ? '' : 'border-[#E0D8CC] bg-white text-[#8B7D72] hover:border-[#C9A96E]'
                        }`}
                        style={active ? { background: v.bg, borderColor: v.border, color: v.text } : {}}
                      >
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.dot }} />
                        {v.label}
                        {active && <span className="ml-0.5 text-[9px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#8B7D72] mt-1.5 leading-relaxed">
                  Pilih semua aroma yang dominan di parfum ini. Pilihan aroma otomatis sinkron dengan <RouterLink to="/admin/quiz-settings" className="text-[#C9A96E] hover:underline">Pengaturan Quiz</RouterLink>.
                </p>
              </div>

              {/* Intensity */}
              <div>
                <label className={lbl}>Kekuatan Aroma — dipakai quiz untuk filter aktivitas</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(f => ({ ...f, intensity: n }))}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${form.intensity === n ? 'bg-[#2C2520] border-[#2C2520] text-white' : 'border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[#8B7D72] mt-1">
                  <span>1 = sangat ringan (olahraga)</span><span>5 = sangat kuat (pesta/date)</span>
                </div>
              </div>

              {/* ── Decant Variants ───────────────────────────────────────────── */}
              {form.category === 'decant' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={lbl + ' mb-0'}>Varian Ukuran (2ml / 5ml / 10ml)</label>
                    <button type="button" onClick={addVariant} className="text-xs text-[#C9A96E] hover:underline flex items-center gap-1">
                      <Plus size={12} /> Tambah
                    </button>
                  </div>
                  {variants.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-2">
                        {['Ukuran', 'Harga (Rp)', 'Stok', ''].map(h => (
                          <div key={h} className="text-[10px] text-[#8B7D72] text-center">{h}</div>
                        ))}
                      </div>
                      {variants.map((v, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-2 items-center">
                          <input value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)} placeholder="5ml" className={inp} />
                          <input type="number" value={v.price} onChange={e => updateVariant(idx, 'price', Number(e.target.value))} placeholder="Harga" className={inp} />
                          <input type="number" value={v.stock} onChange={e => updateVariant(idx, 'stock', Number(e.target.value))} placeholder="Stok" className={inp} />
                          <button type="button" onClick={() => removeVariant(idx)} className="p-1.5 text-[#8B7D72] hover:text-red-500 rounded-lg transition-colors"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button type="button" onClick={addVariant}
                      className="w-full py-3 border border-dashed border-[#E0D8CC] rounded-lg text-xs text-[#8B7D72] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
                      + Tambah varian ukuran (2ml, 5ml, 10ml)
                    </button>
                  )}
                </div>
              )}

              {/* Price + Stock (jika bukan decant ber-varian) */}
              {(form.category !== 'decant' || variants.length === 0) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Harga (Rp)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="0" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Stok</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} placeholder="1" className={inp} />
                  </div>
                </div>
              )}

              {/* Harga asli */}
              <div>
                <label className={lbl}>Harga Asli (opsional — untuk tampilkan diskon)</label>
                <input type="number" value={form.originalPrice ?? ''} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : undefined }))} placeholder="0" className={inp} />
              </div>

              {/* Size + Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Ukuran (single, tanpa varian)</label>
                  <input value={form.size || ''} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="mis. 100ml" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Kondisi (Preloved)</label>
                  <input value={form.condition || ''} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} placeholder="mis. 85% – Box Ada" className={inp} />
                </div>
              </div>

              {/* ── Image Upload ──────────────────────────────────────────────── */}
              <div>
                <label className={lbl}>Gambar Produk</label>

                {/* Tab Switcher */}
                <div className="flex rounded-lg border border-[#E0D8CC] overflow-hidden mb-3">
                  {([
                    { key: 'local',  icon: FolderOpen, label: 'Folder Lokal' },
                    { key: 'url',    icon: Link,        label: 'URL Eksternal' },
                    { key: 'upload', icon: Upload,      label: 'Upload' },
                  ] as const).map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setImgTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
                        imgTab === tab.key
                          ? 'bg-[#2C2520] text-white'
                          : 'bg-white text-[#8B7D72] hover:bg-[#FAF8F4]'
                      }`}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F5F0E8] mb-3">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 truncate">
                      {form.image}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(''); setLocalFilename('');
                        setForm(f => ({ ...f, image: '' }));
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#8B7D72] hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Tab: Folder Lokal */}
                {imgTab === 'local' && (
                  <div>
                    <div className="bg-[#EAF6F9] border border-[#4AACBF]/30 rounded-lg p-3 mb-2">
                      <p className="text-[11px] text-[#1E6878] leading-relaxed">
                        <strong>Cara pakai:</strong> Taruh foto di folder{' '}
                        <code className="bg-white px-1 py-0.5 rounded text-[10px] font-mono">/public/products/</code>
                        {' '}lalu ketik nama filenya di bawah.
                      </p>
                      <p className="text-[10px] text-[#4AACBF] mt-1">
                        Contoh: <span className="font-mono">sauvage-dior.jpg</span> → path otomatis jadi <span className="font-mono">/products/sauvage-dior.jpg</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8B7D72] whitespace-nowrap font-mono">/products/</span>
                      <input
                        value={localFilename}
                        onChange={e => handleLocalFilename(e.target.value)}
                        placeholder="nama-file.jpg"
                        className={inp + ' font-mono text-xs'}
                      />
                    </div>
                    <p className="text-[10px] text-[#8B7D72] mt-1.5">
                      Tips nama file: huruf kecil, spasi ganti tanda hubung (-), contoh: <span className="font-mono">oud-wood-tomford.jpg</span>
                    </p>
                  </div>
                )}

                {/* Tab: URL Eksternal */}
                {imgTab === 'url' && (
                  <div>
                    <div className="bg-[#FDF5E0] border border-[#C89830]/30 rounded-lg p-3 mb-2">
                      <p className="text-[11px] text-[#6B5010] leading-relaxed">
                        Tempel URL gambar dari internet (Unsplash, Google Drive, dll).
                        Foto tetap bergantung pada koneksi & ketersediaan server luar.
                      </p>
                    </div>
                    <input
                      value={form.image.startsWith('data:') || form.image.startsWith('/products/') ? '' : form.image}
                      onChange={e => handleImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className={inp}
                    />
                  </div>
                )}

                {/* Tab: Upload dari Perangkat */}
                {imgTab === 'upload' && (
                  <div>
                    <div className="bg-[#FBF0F4] border border-[#D4819A]/30 rounded-lg p-3 mb-2">
                      <p className="text-[11px] text-[#8B3A55] leading-relaxed">
                        ⚠️ <strong>Hanya sementara.</strong> Foto diubah ke base64 dan{' '}
                        <strong>akan hilang saat halaman di-refresh</strong>. Gunakan tab{' '}
                        <em>Folder Lokal</em> untuk menyimpan foto secara permanen.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#E0D8CC] rounded-lg text-xs text-[#5C5247] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                    >
                      <Upload size={14} /> Pilih Foto dari Perangkat
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={lbl}>Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Deskripsi produk..." className={inp + ' resize-none'} />
              </div>

              {/* Notes */}
              <div>
                <label className={lbl}>Top Notes (pisah koma)</label>
                <input value={notesTop} onChange={e => setNotesTop(e.target.value)} placeholder="mis. Bergamot, Lemon" className={inp} />
              </div>
              <div>
                <label className={lbl}>Middle Notes</label>
                <input value={notesMid} onChange={e => setNotesMid(e.target.value)} placeholder="mis. Rose, Jasmine" className={inp} />
              </div>
              <div>
                <label className={lbl}>Base Notes</label>
                <input value={notesBase} onChange={e => setNotesBase(e.target.value)} placeholder="mis. Sandalwood, Musk" className={inp} />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-[#C9A96E]" />
                <span className="text-sm text-[#5C5247]">Tampilkan sebagai produk unggulan</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#F0EBE1] px-6 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#E0D8CC] text-[#5C5247] rounded-lg text-sm hover:border-[#C9A96E] transition-colors">Batal</button>
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
            <h3 className="font-medium text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>Hapus Produk?</h3>
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