// ─── ScentTab — kelola tipe aroma (tambah / edit / hapus) ───────────────────
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { ScentTypeConfig } from '../../../data/quizConfig';
import { COLOR_PRESETS, getPreset, labelToId, DeleteModal } from './Shared';

// ─── Modal tambah / edit tipe aroma ──────────────────────────────────────────
function ScentModal({
  initial, existingIds, onSave, onClose,
}: {
  initial?: ScentTypeConfig;
  existingIds: string[];
  onSave: (item: ScentTypeConfig) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [label, setLabel]         = useState(initial?.label ?? '');
  const [id, setId]               = useState(initial?.id ?? '');
  const [idManual, setIdManual]   = useState(false);
  const [colorPreset, setColor]   = useState(initial?.colorPreset ?? 'aqua');
  const [error, setError]         = useState('');

  const handleLabelChange = (val: string) => {
    setLabel(val);
    if (!idManual) setId(labelToId(val));
  };

  const handleSave = () => {
    if (!label.trim()) { setError('Nama wajib diisi'); return; }
    if (!id.trim())    { setError('ID wajib diisi'); return; }
    if (!isEdit && existingIds.includes(id)) { setError(`ID "${id}" sudah dipakai`); return; }
    onSave({ id, label: label.trim(), colorPreset });
  };

  const preview = getPreset(colorPreset);

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0D8CC]">
          <h3
            className="text-[#2C2520]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem' }}
          >
            {isEdit ? 'Edit Tipe Aroma' : 'Tambah Tipe Aroma'}
          </h3>
          <button onClick={onClose} className="text-[#8B7D72] hover:text-[#2C2520]">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Preview badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8B7D72] uppercase tracking-widest">Preview:</span>
            <span
              className="px-3 py-1.5 rounded-full text-xs border"
              style={{ background: preview.activeBg, borderColor: preview.activeBg, color: '#fff' }}
            >
              {label || 'Nama Aroma'}
            </span>
          </div>

          {/* Nama */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-1">
              Nama Aroma *
            </label>
            <input
              value={label}
              onChange={e => handleLabelChange(e.target.value)}
              placeholder="cth: Aquatic, Spicy, Musk…"
              className="w-full border border-[#E0D8CC] rounded-xl px-3 py-2 text-sm text-[#2C2520] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          {/* ID */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-1">
              ID Internal{' '}
              <span className="text-[#C9A96E] normal-case tracking-normal">
                (harus cocok dengan scentType produk)
              </span>
            </label>
            <input
              value={id}
              onChange={e => {
                setId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                setIdManual(true);
              }}
              placeholder="cth: aquatic"
              disabled={isEdit}
              className={`w-full border border-[#E0D8CC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E] ${
                isEdit ? 'bg-[#F5F0E8] text-[#8B7D72]' : 'text-[#2C2520]'
              }`}
            />
            <p className="text-[10px] text-[#8B7D72] mt-1">
              {isEdit
                ? 'ID tidak bisa diubah setelah dibuat.'
                : 'Supaya scoring jalan, ID ini harus sama persis dengan nilai scentType di data produk.'}
            </p>
          </div>

          {/* Warna */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-2">
              Warna Badge
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setColor(p.id)}
                  title={p.name}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{
                      background: p.activeBg,
                      borderColor: colorPreset === p.id ? '#2C2520' : 'transparent',
                      boxShadow: colorPreset === p.id ? '0 0 0 2px #fff inset' : 'none',
                    }}
                  />
                  <span className="text-[9px] text-[#8B7D72]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle size={12} /> {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-full border border-[#E0D8CC] text-sm text-[#5C5247] hover:border-[#C9A96E] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-full bg-[#2C2520] text-white text-sm hover:bg-[#C9A96E] transition-colors"
          >
            {isEdit ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ScentCard — satu kartu tipe aroma ───────────────────────────────────────
function ScentCard({
  item, canDelete, onEdit, onDelete,
}: {
  item: ScentTypeConfig;
  canDelete: boolean;
  onEdit: (item: ScentTypeConfig) => void;
  onDelete: (item: ScentTypeConfig) => void;
}) {
  const p = getPreset(item.colorPreset);
  return (
    <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4 flex items-center gap-4">
      {/* Color swatch */}
      <div
        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-xs"
        style={{ background: p.activeBg }}
      >
        {item.label.slice(0, 2)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="text-[#2C2520] truncate"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}
        >
          {item.label}
        </div>
        <div className="text-[11px] text-[#8B7D72] font-mono mt-0.5">id: {item.id}</div>
      </div>

      {/* Preview badge */}
      <span
        className="px-2.5 py-1 rounded-full text-[11px] border shrink-0"
        style={{ background: p.bg, borderColor: p.border, color: p.text }}
      >
        {item.label}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8B7D72] hover:bg-[#F5F0E8] hover:text-[#2C2520] transition-colors"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => canDelete && onDelete(item)}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
            canDelete
              ? 'text-[#8B7D72] hover:bg-red-50 hover:text-red-500'
              : 'text-[#D0C8BE] cursor-not-allowed'
          }`}
          title={canDelete ? 'Hapus' : 'Minimal 1 tipe aroma harus ada'}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── ScentTab — export utama ─────────────────────────────────────────────────
export function ScentTab({
  scentTypes,
  onUpdate,
}: {
  scentTypes: ScentTypeConfig[];
  onUpdate: (newList: ScentTypeConfig[]) => void;
}) {
  const [modal, setModal]         = useState<{ open: boolean; editing?: ScentTypeConfig }>({ open: false });
  const [deleteTarget, setDelete] = useState<ScentTypeConfig | null>(null);

  const handleSave = (item: ScentTypeConfig) => {
    const exists = scentTypes.find(s => s.id === item.id);
    onUpdate(
      exists
        ? scentTypes.map(s => s.id === item.id ? item : s)
        : [...scentTypes, item]
    );
    setModal({ open: false });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    onUpdate(scentTypes.filter(s => s.id !== deleteTarget.id));
    setDelete(null);
  };

  return (
    <div>
      {/* Sub-header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#8B7D72]">
          {scentTypes.length} tipe aroma · ID harus cocok dengan scentType di data produk agar scoring jalan
        </p>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2C2520] text-white text-sm hover:bg-[#C9A96E] transition-colors"
        >
          <Plus size={14} /> Tambah Aroma
        </button>
      </div>

      {/* Info note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-[11px] text-amber-700">
        💡 <strong>Tipe aroma bawaan</strong> (fresh, floral, woody, sweet, citrus, oriental) sudah cocok
        dengan data produk. Kalau tambah tipe baru, pastikan ada produk yang punya scentType sama persis.
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {scentTypes.map(item => (
          <ScentCard
            key={item.id}
            item={item}
            canDelete={scentTypes.length > 1}
            onEdit={item => setModal({ open: true, editing: item })}
            onDelete={setDelete}
          />
        ))}
      </div>

      {/* Modals */}
      {modal.open && (
        <ScentModal
          initial={modal.editing}
          existingIds={scentTypes.map(s => s.id)}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          label={deleteTarget.label}
          onConfirm={handleDelete}
          onClose={() => setDelete(null)}
        />
      )}
    </div>
  );
}
