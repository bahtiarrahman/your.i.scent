// ─── ActivityTab — kelola aktivitas (tambah / edit / hapus) ─────────────────
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { ActivityConfig, ScentTypeConfig } from '../../../data/quizConfig';
import { ScentToggle, IntensityRange, INTENSITY_LABELS, getPreset, labelToId, DeleteModal } from './Shared';

// ─── Modal tambah / edit aktivitas ───────────────────────────────────────────
function ActivityModal({
  initial, existingIds, scentTypes, onSave, onClose,
}: {
  initial?: ActivityConfig;
  existingIds: string[];
  scentTypes: ScentTypeConfig[];
  onSave: (item: ActivityConfig) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [label, setLabel]       = useState(initial?.label ?? '');
  const [sub, setSub]           = useState(initial?.sub ?? '');
  const [id, setId]             = useState(initial?.id ?? '');
  const [idManual, setIdManual] = useState(false);
  const [scents, setScents]     = useState<string[]>(initial?.scents ?? []);
  const [intMin, setIntMin]     = useState(initial?.intensityMin ?? 1);
  const [intMax, setIntMax]     = useState(initial?.intensityMax ?? 3);
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
    onSave({ id, label: label.trim(), sub: sub.trim(), scents, intensityMin: intMin, intensityMax: intMax });
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
            {isEdit ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
          </h3>
          <button onClick={onClose} className="text-[#8B7D72] hover:text-[#2C2520]">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Nama */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-1">
              Nama Aktivitas *
            </label>
            <input
              value={label}
              onChange={e => handleLabelChange(e.target.value)}
              placeholder="cth: Traveling"
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
              placeholder="cth: Outdoor, petualangan"
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
              placeholder="cth: traveling"
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
              <span className="text-[#C9A96E] normal-case tracking-normal">(+25 poin)</span>
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

          {/* Intensity */}
          <div>
            <label className="text-[11px] text-[#8B7D72] uppercase tracking-widest block mb-2">
              Range Kekuatan Ideal{' '}
              <span className="text-[#C9A96E] normal-case tracking-normal">(+15 poin)</span>
            </label>
            <IntensityRange
              min={intMin} max={intMax}
              onChange={(mn, mx) => { setIntMin(mn); setIntMax(mx); }}
            />
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

// ─── ActivityCard — satu kartu aktivitas ─────────────────────────────────────
function ActivityCard({
  item, scentTypes, canDelete, onToggleScent, onChangeIntensity, onEdit, onDelete,
}: {
  item: ActivityConfig;
  scentTypes: ScentTypeConfig[];
  canDelete: boolean;
  onToggleScent: (id: string, scentId: string) => void;
  onChangeIntensity: (id: string, min: number, max: number) => void;
  onEdit: (item: ActivityConfig) => void;
  onDelete: (item: ActivityConfig) => void;
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
            title={canDelete ? 'Hapus' : 'Minimal 1 aktivitas harus ada'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Scent toggles */}
      <div className="mb-4">
        <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">
          Aroma cocok <span className="text-[#C9A96E]">(+25 poin)</span>
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

      {/* Intensity */}
      <div>
        <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">
          Kekuatan ideal <span className="text-[#C9A96E]">(+15 poin)</span>
        </div>
        <IntensityRange
          min={item.intensityMin} max={item.intensityMax}
          onChange={(mn, mx) => onChangeIntensity(item.id, mn, mx)}
        />
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
          {' '}& intensity {item.intensityMin}–{item.intensityMax} dapat poin lebih.
        </div>
      </div>
    </div>
  );
}

// ─── ActivityTab — export utama ──────────────────────────────────────────────
export function ActivityTab({
  activities, scentTypes, onUpdate,
}: {
  activities: ActivityConfig[];
  scentTypes: ScentTypeConfig[];
  onUpdate: (newList: ActivityConfig[]) => void;
}) {
  const [modal, setModal]         = useState<{ open: boolean; editing?: ActivityConfig }>({ open: false });
  const [deleteTarget, setDelete] = useState<ActivityConfig | null>(null);

  const toggleScent = (activityId: string, scentId: string) => {
    onUpdate(activities.map(a =>
      a.id !== activityId ? a : {
        ...a,
        scents: a.scents.includes(scentId)
          ? a.scents.filter(s => s !== scentId)
          : [...a.scents, scentId],
      }
    ));
  };

  const changeIntensity = (activityId: string, min: number, max: number) => {
    onUpdate(activities.map(a =>
      a.id !== activityId ? a : { ...a, intensityMin: min, intensityMax: max }
    ));
  };

  const handleSave = (item: ActivityConfig) => {
    const exists = activities.find(a => a.id === item.id);
    onUpdate(exists
      ? activities.map(a => a.id === item.id ? item : a)
      : [...activities, item]
    );
    setModal({ open: false });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    onUpdate(activities.filter(a => a.id !== deleteTarget.id));
    setDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#8B7D72]">
          {activities.length} aktivitas
        </p>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2C2520] text-white text-sm hover:bg-[#C9A96E] transition-colors"
        >
          <Plus size={14} /> Tambah Aktivitas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activities.map(item => (
          <ActivityCard
            key={item.id}
            item={item}
            scentTypes={scentTypes}
            canDelete={activities.length > 1}
            onToggleScent={toggleScent}
            onChangeIntensity={changeIntensity}
            onEdit={item => setModal({ open: true, editing: item })}
            onDelete={setDelete}
          />
        ))}
      </div>

      {modal.open && (
        <ActivityModal
          initial={modal.editing}
          existingIds={activities.map(a => a.id)}
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
