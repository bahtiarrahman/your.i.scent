// ─── Shared — komponen & konstanta yang dipakai semua tab quiz ───────────────
import React from 'react';
import { Trash2 } from 'lucide-react';
import { ScentTypeConfig } from '../../../data/quizConfig';

// ─── Palette warna yang bisa dipilih admin untuk tipe aroma ──────────────────
export const COLOR_PRESETS: {
  id: string; name: string;
  bg: string; border: string; text: string; activeBg: string;
}[] = [
  { id: 'aqua',   name: 'Aqua',   bg: '#EAF6F9', border: '#4AACBF', text: '#1E6878', activeBg: '#4AACBF' },
  { id: 'pink',   name: 'Rose',   bg: '#FBF0F4', border: '#D4819A', text: '#8B3A55', activeBg: '#D4819A' },
  { id: 'brown',  name: 'Woody',  bg: '#F5EDE0', border: '#A07040', text: '#5C3820', activeBg: '#A07040' },
  { id: 'gold',   name: 'Gold',   bg: '#FDF5E0', border: '#C89830', text: '#6B5010', activeBg: '#C89830' },
  { id: 'orange', name: 'Citrus', bg: '#FEF3E4', border: '#D88030', text: '#6B4010', activeBg: '#D88030' },
  { id: 'purple', name: 'Violet', bg: '#F0EBF8', border: '#8B5EAB', text: '#4A2870', activeBg: '#8B5EAB' },
  { id: 'green',  name: 'Forest', bg: '#EBF5EC', border: '#4CAF60', text: '#1E5C28', activeBg: '#4CAF60' },
  { id: 'navy',   name: 'Marine', bg: '#EAF0FB', border: '#4A6EC0', text: '#1E3878', activeBg: '#4A6EC0' },
  { id: 'red',    name: 'Spice',  bg: '#FBF0F0', border: '#C05050', text: '#6B2020', activeBg: '#C05050' },
  { id: 'grey',   name: 'Smoke',  bg: '#F0F0F0', border: '#808080', text: '#404040', activeBg: '#808080' },
];

// Ambil warna dari preset id
export function getPreset(presetId: string) {
  return COLOR_PRESETS.find(p => p.id === presetId) ?? COLOR_PRESETS[0];
}

// ─── Helper: label → id ───────────────────────────────────────────────────────
export function labelToId(label: string): string {
  return label.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

// ─── Intensity labels ─────────────────────────────────────────────────────────
export const INTENSITY_LABELS: Record<number, string> = {
  1: 'Sangat Ringan', 2: 'Ringan', 3: 'Sedang', 4: 'Kuat', 5: 'Sangat Kuat',
};

// ─── ScentToggle — badge klik untuk toggle aroma ─────────────────────────────
export function ScentToggle({
  scent, active, onClick,
}: {
  scent: ScentTypeConfig;
  active: boolean;
  onClick: () => void;
}) {
  const p = getPreset(scent.colorPreset);
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs transition-all duration-150 border select-none"
      style={
        active
          ? { background: p.activeBg, borderColor: p.activeBg, color: '#fff' }
          : { background: '#F5F0E8', borderColor: '#E0D8CC', color: '#8B7D72' }
      }
    >
      {scent.label}
    </button>
  );
}

// ─── IntensityRange — pilih range 1–5 secara visual ─────────────────────────
export function IntensityRange({
  min, max, onChange,
}: {
  min: number; max: number;
  onChange: (min: number, max: number) => void;
}) {
  const handleClick = (val: number) => {
    if (val < min) onChange(val, max);
    else if (val > max) onChange(min, val);
    else {
      const distMin = val - min;
      const distMax = max - val;
      if (distMin <= distMax) onChange(val, max);
      else onChange(min, val);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            onClick={() => handleClick(val)}
            title={INTENSITY_LABELS[val]}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-150 border"
            style={
              val >= min && val <= max
                ? { background: '#C9A96E', borderColor: '#C9A96E', color: '#fff' }
                : { background: '#F5F0E8', borderColor: '#E0D8CC', color: '#8B7D72' }
            }
          >
            {val}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-[#8B7D72]">
        <span className="text-[#C9A96E]">{INTENSITY_LABELS[min]}</span>
        {' → '}
        <span className="text-[#C9A96E]">{INTENSITY_LABELS[max]}</span>
      </div>
    </div>
  );
}

// ─── DeleteModal — konfirmasi hapus ──────────────────────────────────────────
export function DeleteModal({
  label, onConfirm, onClose,
}: {
  label: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={15} className="text-red-500" />
          </div>
          <h3
            className="text-[#2C2520]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
          >
            Hapus "{label}"?
          </h3>
        </div>
        <p className="text-sm text-[#5C5247] mb-5">
          Item ini akan dihapus dari daftar. Pastikan sudah tidak digunakan di tempat lain.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-full border border-[#E0D8CC] text-sm text-[#5C5247] hover:border-[#C9A96E] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
