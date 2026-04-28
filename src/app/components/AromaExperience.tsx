import React from 'react';
import { Product, ScentType } from '../data/products';

// ─── scent palette ────────────────────────────────────────────────────────────
const SCENT_CONFIG: Record<ScentType, {
  label: string;
  bg: string;
  accent: string;
  text: string;
  pyramid: string[];
  intensityColor: string;
}> = {
  fresh: {
    label: 'Fresh / Segar',
    bg: '#EAF6F9',
    accent: '#4AACBF',
    text: '#1E6878',
    pyramid: ['#B8E8F2', '#7ACFE0', '#4AACBF'],
    intensityColor: '#4AACBF',
  },
  floral: {
    label: 'Floral',
    bg: '#FBF0F4',
    accent: '#D4819A',
    text: '#8B3A55',
    pyramid: ['#F5C8D8', '#E8A0BA', '#D4819A'],
    intensityColor: '#D4819A',
  },
  woody: {
    label: 'Woody',
    bg: '#F5EDE0',
    accent: '#A07040',
    text: '#5C3820',
    pyramid: ['#D8C0A0', '#B89060', '#A07040'],
    intensityColor: '#A07040',
  },
  sweet: {
    label: 'Sweet / Manis',
    bg: '#FDF5E0',
    accent: '#C89830',
    text: '#6B5010',
    pyramid: ['#F5E0A0', '#E8C870', '#C89830'],
    intensityColor: '#C89830',
  },
  citrus: {
    label: 'Citrus',
    bg: '#FEF3E4',
    accent: '#D88030',
    text: '#6B4010',
    pyramid: ['#F8D8A0', '#EEB060', '#D88030'],
    intensityColor: '#D88030',
  },
  oriental: {
    label: 'Oriental',
    bg: '#F0EBF8',
    accent: '#8B5EAB',
    text: '#4A2870',
    pyramid: ['#D0B8E8', '#B090D0', '#8B5EAB'],
    intensityColor: '#8B5EAB',
  },

  // tambahan (tetap dipakai)
  gourmand: {
    label: 'Gourmand',
    bg: '#FFF4E6',
    accent: '#C68A2B',
    text: '#6A3E00',
    pyramid: ['#F5D6A0', '#E8B870', '#C68A2B'],
    intensityColor: '#C68A2B',
  },
  fruity: {
    label: 'Fruity',
    bg: '#EAF7EC',
    accent: '#4CAF6A',
    text: '#1F6B3A',
    pyramid: ['#BFE8C9', '#7FD89A', '#4CAF6A'],
    intensityColor: '#4CAF6A',
  },
  spicy: {
    label: 'Spicy',
    bg: '#FDECEC',
    accent: '#D64545',
    text: '#7A1F1F',
    pyramid: ['#F5B0B0', '#E57373', '#D64545'],
    intensityColor: '#D64545',
  },
  musky: {
    label: 'Musky',
    bg: '#F2F2F2',
    accent: '#888888',
    text: '#444444',
    pyramid: ['#D6D6D6', '#B0B0B0', '#888888'],
    intensityColor: '#888888',
  },
  powdery: {
    label: 'Powdery',
    bg: '#F9F3F7',
    accent: '#D8A8C0',
    text: '#7A4B61',
    pyramid: ['#EAC8D8', '#D8A8C0', '#C088A8'],
    intensityColor: '#D8A8C0',
  },
  green: {
    label: 'Green',
    bg: '#EAF6EA',
    accent: '#4CAF50',
    text: '#1B5E20',
    pyramid: ['#C8E6C9', '#81C784', '#4CAF50'],
    intensityColor: '#4CAF50',
  },
};

const INTENSITY_LABELS: Record<number, string> = {
  1: 'Sangat Ringan',
  2: 'Ringan',
  3: 'Sedang',
  4: 'Kuat',
  5: 'Sangat Kuat',
};

interface Props {
  product: Product;
}

export function AromaExperience({ product }: Props) {
  // Use first scent type for primary theme (biasanya yang paling dominan)
  const cfg = SCENT_CONFIG[product.scentType[0] || 'fresh'];

  const pyramidLayers = [
    { label: 'Top Notes',    notes: product.notes.top,    widthClass: 'w-[45%]',  index: 0 },
    { label: 'Middle Notes', notes: product.notes.middle, widthClass: 'w-[72%]',  index: 1 },
    { label: 'Base Notes',   notes: product.notes.base,   widthClass: 'w-full',   index: 2 },
  ];

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: cfg.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-[#2C2520]">Aroma Experience</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* ─── Pyramid ───────────────────────────────── */}
        <div>
          <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-3">
            Fragrance Pyramid
          </div>
          <div className="flex flex-col items-center gap-1.5">
            {pyramidLayers.map((layer) => (
              <div key={layer.label} className={`${layer.widthClass} transition-all duration-300`}>
                <div
                  className="rounded-lg px-3 py-2.5 flex items-start justify-between gap-2"
                  style={{ background: cfg.pyramid[layer.index] + 'CC' }}
                >
                  <div>
                    <div
                      className="text-[9px] uppercase tracking-widest mb-1"
                      style={{ color: cfg.text }}
                    >
                      {layer.label}
                    </div>
                    <div className="text-xs text-[#2C2520]">
                      {layer.notes.join(' · ')}
                    </div>
                  </div>
                  {/* Layer depth indicator */}
                  <div
                    className="w-1 rounded-full self-stretch flex-shrink-0 opacity-60"
                    style={{ background: cfg.accent }}
                  />
                </div>
              </div>
            ))}
            {/* Base label */}
            <div className="text-[9px] text-[#8B7D72] mt-1 tracking-widest uppercase">
              ▲ Volatilitas — dari cepat ke tahan lama
            </div>
          </div>
        </div>

        {/* ─── Intensity + Color ─────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Intensity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#8B7D72] uppercase tracking-widest">
                Kekuatan Aroma
              </span>
              <span className="text-[10px]" style={{ color: cfg.text }}>
                {INTENSITY_LABELS[product.intensity] ?? '—'}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: i <= product.intensity ? cfg.accent : cfg.accent + '28',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-[#8B7D72] mt-1">
              <span>Ringan</span>
              <span>Kuat</span>
            </div>
          </div>

          {/* Colour swatch */}
          <div>
            <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">
              Representasi Warna
            </div>
            <div className="flex gap-2">
              {cfg.pyramid.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-10 rounded-lg"
                  style={{ background: color }}
                  title={pyramidLayers[i]?.label}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-[#8B7D72] mt-1">
              <span>Top</span>
              <span>Middle</span>
              <span>Base</span>
            </div>
          </div>

          {/* Notes explanation */}
          <div>
            <div className="text-[10px] text-[#8B7D72] uppercase tracking-widest mb-2">
              Tentang Fragrance Notes
            </div>
            <div className="space-y-2 text-[11px] text-[#5C5247] leading-relaxed">
              <p><strong style={{ color: cfg.text }}>Top Notes:</strong> Aroma pertama yang tercium, bertahan 15-30 menit</p>
              <p><strong style={{ color: cfg.text }}>Middle Notes:</strong> Jantung parfum, muncul setelah top notes menguap</p>
              <p><strong style={{ color: cfg.text }}>Base Notes:</strong> Aroma dasar yang paling tahan lama (4-6 jam)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
