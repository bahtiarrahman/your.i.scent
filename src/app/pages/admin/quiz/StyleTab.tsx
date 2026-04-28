// ─── StyleTab — kelola kepribadian (tambah / edit / hapus) ──────────────────
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { StyleConfig, ScentTypeConfig } from '../../../data/quizConfig';
import { ScentToggle, getPreset, labelToId, DeleteModal } from './Shared';

// ─── Modal tambah / edit kepribadian ─────────────────────────────────────────
function StyleModal({
  initial, existingIds, scentTypes, onSave, onClose,
}: {
  initial?: StyleConfig;
  existingIds: string[];
  scentTypes: ScentTypeConfig[];
  onSave: (item: StyleConfig) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [label, setLabel]       = useState(initial?.label ?? '');
  const [sub, setSub]           = useState(initial?.sub ?? '');
  const [id, setId]             = useState(initial?.id ?? '');
  const [idManual, setIdManual] = useState(false);
  const [scents, setScents]     = useState<string[]>(initial?.scents ?? []);
  const [error, setError]       = useState('');

  const handleLabelChange = (val: string) => {
    setLabel(val);
    if (!idManual) setId(labelToId(val));
  };

  const toggleScent = (scentId: string) => {
    setScents(prev =>
      prev.includes(scentId) ? prev.filter(s => s !== scentId) : [...prev, scentId]
    );
  };

  const handleSave = () => {
    if (!label.trim()) { setError('Nama wajib diisi'); return; }
    if (!id.trim())    { setError('ID wajib diisi'); return; }
    if (!isEdit && existingIds.includes(id)) { setError(`ID "${id}" sudah dipakai`); return; }
    if (scents.length === 0) { setError('Pilih minimal 1 aroma'); return; }
    onSave({ id, label: label.trim(), sub: sub.trim(), scents });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0D8CC]">
          <h3
            className="text-[#2C2520]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem' }}
          >
            {isEdit ? 'Edit Kepribadian' : 'Tambah Kepribadian'}
          </h3>
          <button onClick={onClose} className="text-[#8B7D72] hover:text-[#2C2520]">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Nama */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-1">
              Nama Kepribadian *
            </label>
            <input
              value={label}
              onChange={e => handleLabelChange(e.target.value)}
              placeholder="cth: Adventurous"
              className="w-full border border-[#E0D8CC] rounded-xl px-3 py-2 text-sm text-[#2C2520] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          {/* Sub */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-1">
              Deskripsi Singkat
            </label>
            <input
              value={sub}
              onChange={e => setSub(e.target.value)}
              placeholder="cth: Suka tantangan, energetik"
              className="w-full border border-[#E0D8CC] rounded-xl px-3 py-2 text-sm text-[#2C2520] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          {/* ID */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-1">
              ID Internal
            </label>
            <input
              value={id}
              onChange={e => {
                setId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                setIdManual(true);
              }}
              placeholder="cth: adventurous"
              disabled={isEdit}
              className={`w-full border border-[#E0D8CC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E] ${
                isEdit ? 'bg-[#F5F0E8] text-[#8B7D72]' : 'text-[#2C2520]'
              }`}
            />
            {!isEdit && (
              <p className="text-[10px] text-[#8B7D72] mt-1">
                Otomatis dari nama. Tidak bisa diubah setelah disimpan.
              </p>
            )}
          </div>

          {/* Aroma */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-2">
              Aroma yang Cocok *{' '}
              <span className="text-[#C9A96E] normal-case tracking-normal">(+20 poin)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {scentTypes.map(s => (
                <ScentToggle
                  key={s.id}
                  scent={s}
                  active={scents.includes(s.id)}
                  onClick={() => toggleScent(s.id)}
                />
              ))}
            </div>
            {scents.length === 0 && (
              <p className="text-[11px] text-red-400 mt-2">Pilih minimal 1 aroma</p>
            )}
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

// ─── StyleCard — satu kartu kepribadian ──────────────────────────────────────
function StyleCard({
  item, scentTypes, canDelete, onToggleScent, onEdit, onDelete,
}: {
  item: StyleConfig;
  scentTypes: ScentTypeConfig[];
  canDelete: boolean;
  onToggleScent: (id: string, scentId: string) => void;
  onEdit: (item: StyleConfig) => void;
  onDelete: (item: StyleConfig) => void;
}) {
  const activeScents = scentTypes.filter(s => item.scents.includes(s.id));

  return (
    <div className="bg-white rounded-2xl border border-[#E0D8CC] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div
            className="text-[#2C2520]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem' }}
          >
            {item.label}
          </div>
          {item.sub && <div className="text-[11px] text-[#8B7D72] mt-0.5">{item.sub}</div>}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded-full">
            {item.scents.length} aroma
          </span>
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
            title={canDelete ? 'Hapus' : 'Minimal 1 kepribadian harus ada'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Scent toggles */}
      <div className="mb-4">
        <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">
          Aroma cocok <span className="text-[#C9A96E]">(+20 poin)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {scentTypes.map(s => (
            <ScentToggle
              key={s.id}
              scent={s}
              active={item.scents.includes(s.id)}
              onClick={() => onToggleScent(item.id, s.id)}
            />
          ))}
        </div>
        {item.scents.length === 0 && (
          <p className="text-[11px] text-red-400 mt-2">⚠ Pilih minimal 1 aroma</p>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4 pt-3 border-t border-[#F0EAE0]">
        <div className="text-[11px] text-[#5C5247] bg-[#F5F0E8] rounded-lg px-3 py-2">
          Pilih <span className="text-[#2C2520]">"{item.label}"</span> → aroma{' '}
          {activeScents.length > 0
            ? activeScents.map(s => {
                const p = getPreset(s.colorPreset);
                return (
                  <span
                    key={s.id}
                    className="inline-block mx-0.5 px-1.5 py-0.5 rounded text-[10px]"
                    style={{ background: p.bg, color: p.text }}
                  >
                    {s.label}
                  </span>
                );
              })
            : <span className="text-red-400">— belum ada —</span>
          }
          {' '}dapat poin lebih.
        </div>
      </div>
    </div>
  );
}

// ─── StyleTab — export utama ─────────────────────────────────────────────────
export function StyleTab({
  styles, scentTypes, onUpdate,
}: {
  styles: StyleConfig[];
  scentTypes: ScentTypeConfig[];
  onUpdate: (newList: StyleConfig[]) => void;
}) {
  const [modal, setModal]         = useState<{ open: boolean; editing?: StyleConfig }>({ open: false });
  const [deleteTarget, setDelete] = useState<StyleConfig | null>(null);

  const toggleScent = (styleId: string, scentId: string) => {
    onUpdate(styles.map(s =>
      s.id !== styleId ? s : {
        ...s,
        scents: s.scents.includes(scentId)
          ? s.scents.filter(x => x !== scentId)
          : [...s.scents, scentId],
      }
    ));
  };

  const handleSave = (item: StyleConfig) => {
    const exists = styles.find(s => s.id === item.id);
    onUpdate(exists
      ? styles.map(s => s.id === item.id ? item : s)
      : [...styles, item]
    );
    setModal({ open: false });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    onUpdate(styles.filter(s => s.id !== deleteTarget.id));
    setDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#8B7D72]">
          {styles.length} kepribadian · Klik badge untuk toggle aroma yang cocok
        </p>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2C2520] text-white text-sm hover:bg-[#C9A96E] transition-colors"
        >
          <Plus size={14} /> Tambah Kepribadian
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {styles.map(item => (
          <StyleCard
            key={item.id}
            item={item}
            scentTypes={scentTypes}
            canDelete={styles.length > 1}
            onToggleScent={toggleScent}
            onEdit={item => setModal({ open: true, editing: item })}
            onDelete={setDelete}
          />
        ))}
      </div>

      {modal.open && (
        <StyleModal
          initial={modal.editing}
          existingIds={styles.map(s => s.id)}
          scentTypes={scentTypes}
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
