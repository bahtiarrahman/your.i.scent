// ─── Quiz Config ──────────────────────────────────────────────────────────────
//  Semua data quiz (tipe aroma, aktivitas, kepribadian) disimpan di sini.
//  Admin bisa ubah lewat /admin/quiz-settings.
//  Data disimpan di localStorage (key: youri_quiz_config).
// ──────────────────────────────────────────────────────────────────────────────

// Tipe aroma (bisa ditambah/edit/hapus lewat admin)
export interface ScentTypeConfig {
  id: string;          // harus cocok dengan product.scentType untuk scoring
  label: string;       // nama tampil, cth: "Fresh & Segar"
  colorPreset: string; // salah satu id dari COLOR_PRESETS di Shared.tsx
}

// Aktivitas pengguna
export interface ActivityConfig {
  id: string;
  label: string;
  sub: string;
  scents: string[];       // id aroma yang cocok → +25 poin
  intensityMin: number;   // range kekuatan ideal (1–5) → +15 poin
  intensityMax: number;
}

// Kepribadian / gaya pengguna
export interface StyleConfig {
  id: string;
  label: string;
  sub: string;
  scents: string[];       // id aroma yang cocok → +20 poin
}

export interface QuizConfig {
  scentTypes: ScentTypeConfig[];
  activities: ActivityConfig[];
  styles: StyleConfig[];
}

// ─── Default config ───────────────────────────────────────────────────────────

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  scentTypes: [
    { id: 'fresh',        label: 'Fresh',           colorPreset: 'aqua'   },
    { id: 'floral',       label: 'Floral',          colorPreset: 'pink'   },
    { id: 'woody',        label: 'Woody',           colorPreset: 'brown'  },
    { id: 'sweet',        label: 'Sweet',           colorPreset: 'gold'   },
    { id: 'citrus',       label: 'Citrus',          colorPreset: 'orange' },
    { id: 'oriental',     label: 'Oriental',        colorPreset: 'purple' },
  ],
  activities: [
    {
      id: 'office',
      label: 'Kerja / Kuliah',
      sub: 'Profesional, indoor',
      scents: ['woody', 'citrus', 'freshaquatic', 'fruity', 'spicy', 'musky'],
      intensityMin: 1,
      intensityMax: 4,
    },
    {
      id: 'sport',
      label: 'Olahraga',
      sub: 'Aktif, outdoor',
      scents: ['floral', 'citrus', 'freshaquatic', 'fruity'],
      intensityMin: 1,
      intensityMax: 3,
    },
    {
      id: 'date',
      label: 'Kencan',
      sub: 'Romantis, evening',
      scents: ['floral', 'woody', 'sweet', 'oriental'],
      intensityMin: 3,
      intensityMax: 5,
    },
    {
      id: 'casual',
      label: 'Jalan Santai',
      sub: 'Casual, weekend',
      scents: ['floral', 'sweet', 'citrus', 'freshaquatic', 'fruity', 'spicy', 'green'],
      intensityMin: 1,
      intensityMax: 3,
    },
    {
      id: 'party',
      label: 'Pesta & Event',
      sub: 'Malam, statement',
      scents: ['woody', 'sweet', 'oriental', 'freshaquatic', 'gourmand', 'spicy'],
      intensityMin: 1,
      intensityMax: 4,
    },
  ],
  styles: [
    {
      id: 'luxury',
      label: 'Elegan',
      sub: 'Premium, berkelas',
      scents: ['floral', 'woody', 'oriental', 'spicy', 'musky', 'green'],
    },
    {
      id: 'casual',
      label: 'Kasual',
      sub: 'Santai, versatile',
      scents: ['sweet', 'citrus'],
    },
    {
      id: 'bold',
      label: 'Bold',
      sub: 'Berani, ekspresif',
      scents: ['woody', 'oriental', 'spicy'],
    },
    {
      id: 'romantic',
      label: 'Romantis',
      sub: 'Feminin, dreamy',
      scents: ['floral', 'sweet', 'gourmand'],
    },
    {
      id: 'energetic',
      label: 'Energic',
      sub: 'Semangat, percaya diri',
      scents: ['citrus', 'fruity', 'spicy'],
    },
    {
      id: 'minimal',
      label: 'Minimalis',
      sub: 'Clean, simple, effortless',
      scents: ['citrus', 'freshaquatic', 'musky'],
    },
  ]
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'youri_quiz_config';

export function loadQuizConfig(): QuizConfig {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<QuizConfig>;
      // Merge supaya field baru dari DEFAULT tetap ada
      return {
        scentTypes: parsed.scentTypes ?? DEFAULT_QUIZ_CONFIG.scentTypes,
        activities: parsed.activities ?? DEFAULT_QUIZ_CONFIG.activities,
        styles:     parsed.styles     ?? DEFAULT_QUIZ_CONFIG.styles,
      };
    }
  } catch { /* localStorage corrupt → pakai default */ }
  return DEFAULT_QUIZ_CONFIG;
}

export function saveQuizConfig(config: QuizConfig): void {
  localStorage.setItem(LS_KEY, JSON.stringify(config));
}

export function resetQuizConfig(): void {
  localStorage.removeItem(LS_KEY);
}
