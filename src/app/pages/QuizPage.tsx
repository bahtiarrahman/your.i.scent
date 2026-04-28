import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { PRODUCTS, ScentType } from '../data/products';
import { loadQuizConfig } from '../data/quizConfig';
import { ProductCard } from '../components/ProductCard';

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuizOption {
  value: string;
  label: string;
  sub?: string;
}

interface Question {
  id: string;
  question: string;
  helpText?: string;
  options: QuizOption[];
}

// ─── Mapping: jawaban quiz → scentType ───────────────────────────────────────
//
//  Logika ini sekarang DIBACA dari quizConfig (localStorage).
//  Admin bisa ubah lewat /admin/quiz-settings tanpa sentuh kode.
//
const ACTIVITY_SCENT_AFFINITY: Record<string, ScentType[]> = {
  office:  ['fresh', 'woody', 'citrus'],            // profesional, tidak mencolok
  sport:   ['fresh', 'citrus'],                      // ringan, bersih, non-heavy
  date:    ['oriental', 'floral', 'sweet', 'woody'], // seduktif, memorable
  casual:  ['fresh', 'citrus', 'sweet', 'floral'],   // versatile, fun
  party:   ['oriental', 'woody', 'sweet'],            // statement, malam hari
};

const STYLE_SCENT_AFFINITY: Record<string, ScentType[]> = {
  minimal:  ['fresh', 'floral', 'citrus'],            // clean, tidak berlebihan
  luxury:   ['oriental', 'woody', 'floral'],          // mewah, berat, kompleks
  casual:   ['fresh', 'citrus', 'sweet'],             // everyday, santai
  bold:     ['oriental', 'woody'],                    // kuat, intense, berkarakter
  romantic: ['floral', 'sweet', 'oriental'],          // lembut, dreamy
};

// Kisaran intensity ideal per aktivitas (skala 1–5)
const ACTIVITY_INTENSITY: Record<string, [number, number]> = {
  office:  [1, 3],   // tidak terlalu kuat di ruang tertutup
  sport:   [1, 2],   // ringan supaya tidak menyengat saat gerak
  date:    [3, 5],   // perlu daya tahan & kesan
  casual:  [1, 3],   // nyaman sepanjang hari
  party:   [3, 5],   // statement, tahan lama
};

// ─── Scoring system: semua 4 jawaban dipakai ─────────────────────────────────
//
//  Bobot skor:
//    Scent langsung cocok  → +40  (pilihan utama user)
//    Activity affinity     → +25  (konteks pemakaian)
//    Intensity sesuai      → +15  (kenyamanan)
//    Style affinity        → +20  (kepribadian)
//    Featured bonus        → +5
//    Budget tidak cocok    → 100 (penalti keras)
//
function getRecommendations(answers: Record<string, string>) {
  const cfg = loadQuizConfig();
  const { scent, activity, style, budget } = answers;

  const inBudget = (price: number) => {
    if (budget === 'low')     return price < 100000;
    if (budget === 'mid')     return price >= 100000 && price <= 500000;
    if (budget === 'high')    return price > 500000 && price <= 1000000;
    if (budget === 'premium') return price > 1000000;
    return true;
  };

  const activityCfg = cfg.activities.find(a => a.id === activity);
  const styleCfg    = cfg.styles.find(s => s.id === style);

  const scored = PRODUCTS.map(p => {
    let score = 0;

    // Scent match: +40 poin jika salah satu scentType produk cocok
    if (scent && p.scentType.includes(scent as ScentType)) score += 40;

    if (activityCfg) {
      // Activity match: +25 poin jika ada overlap antara scent produk & activity scents
      if (p.scentType.some(s => activityCfg.scents.includes(s))) score += 25;
      if (p.intensity >= activityCfg.intensityMin && p.intensity <= activityCfg.intensityMax) score += 15;
    }

    // Style match: +20 poin jika ada overlap antara scent produk & style scents
    if (styleCfg && p.scentType.some(s => styleCfg.scents.includes(s))) score += 20;

    if (budget && !inBudget(p.price)) score -= 100;

    if (p.featured) score += 5;

    return { product: p, score };
  });

  const results = scored
    .sort((a, b) => b.score - a.score)
    .filter(s => s.score > -50)
    .map(s => s.product);

  return results.length >= 2 ? results.slice(0, 4) : PRODUCTS.slice(0, 4);
}

// ─── Mengapa produk ini cocok (untuk label di kartu hasil) ───────────────────
function getMatchReason(
  product: (typeof PRODUCTS)[0],
  answers: Record<string, string>
): string {
  const cfg = loadQuizConfig();
  const reasons: string[] = [];
  if (answers.scent && product.scentType.includes(answers.scent as ScentType))
    reasons.push(scentDescriptions[answers.scent]);
  const activityCfg = cfg.activities.find(a => a.id === answers.activity);
  if (activityCfg && product.scentType.some(s => activityCfg.scents.includes(s)))
    reasons.push('cocok aktivitasmu');
  const styleCfg = cfg.styles.find(s => s.id === answers.style);
  if (styleCfg && product.scentType.some(s => styleCfg.scents.includes(s)))
    reasons.push('sesuai gayamu');
  return reasons.length > 0 ? reasons.join(' · ') : 'pilihan terpopuler';
}

// ─── Data pertanyaan ─────────────────────────────────────────────────────────
const scentDescriptions: Record<string, string> = {
  fresh:    'Fresh & Segar',
  floral:   'Floral',
  woody:    'Woody & Hangat',
  sweet:    'Sweet & Gourmand',
  citrus:   'Citrus & Fruity',
  oriental: 'Oriental & Misterius',
};

// ─── Komponen ─────────────────────────────────────────────────────────────────
export function QuizPage() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone]       = useState(false);

  // Baca config dari localStorage supaya opsi aktivitas & kepribadian
  // yang dibuat admin muncul di sini secara otomatis
  const cfg = loadQuizConfig();

  const questions: Question[] = [
    {
      id: 'scent',
      question: 'Aroma apa yang paling kamu sukai?',
      helpText: 'Ini jadi sinyal utama rekomendasi',
      options: [
        { value: 'fresh',    label: 'Fresh & Segar',       sub: 'Ringan, bersih, angin pagi' },
        { value: 'floral',   label: 'Floral',               sub: 'Bunga, feminin, lembut' },
        { value: 'woody',    label: 'Woody & Hangat',       sub: 'Kayu, oud, maskulin' },
        { value: 'sweet',    label: 'Sweet & Gourmand',     sub: 'Manis, vanila, lembut' },
        { value: 'citrus',   label: 'Citrus & Fruity',      sub: 'Buah, segar, ceria' },
        { value: 'oriental', label: 'Oriental & Misterius', sub: 'Bold, dalam, berkarakter' },
      ],
    },
    {
      id: 'activity',
      question: 'Aktivitas apa yang paling sering kamu lakukan?',
      helpText: 'Dipakai untuk mencocokkan kekuatan & karakter aroma',
      // Otomatis dari config admin — tambah/hapus di /admin/quiz-settings
      options: cfg.activities.map(a => ({ value: a.id, label: a.label, sub: a.sub })),
    },
    {
      id: 'style',
      question: 'Bagaimana kamu menggambarkan kepribadianmu?',
      helpText: 'Membantu mencocokkan karakter parfum dengan kepribadian',
      // Otomatis dari config admin — tambah/hapus di /admin/quiz-settings
      options: cfg.styles.map(s => ({ value: s.id, label: s.label, sub: s.sub })),
    },
    {
      id: 'budget',
      question: 'Berapa budget yang kamu siapkan?',
      helpText: 'Budget akan menyaring kategori produk yang tepat',
      options: [
        { value: 'low',     label: 'Di bawah Rp 100k',  sub: 'Cocok untuk decant sample' },
        { value: 'mid',     label: 'Rp 100k – 500k',    sub: 'Decant besar / preloved entry' },
        { value: 'high',    label: 'Rp 500k – 1 Juta',  sub: 'Preloved premium' },
        { value: 'premium', label: 'Di atas Rp 1 Juta', sub: 'BNIB / koleksi' },
      ],
    },
  ];

  const currentQuestion = questions[step];
  const totalSteps      = questions.length;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    if (step < totalSteps - 1) setTimeout(() => setStep(step + 1), 220);
    else                        setTimeout(() => setDone(true), 220);
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  const recommendations = done ? getRecommendations(answers) : [];

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#2C2520] py-16 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-6 h-px bg-[#C9A96E]" />
          <span className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase">Fragrance Quiz</span>
          <div className="w-6 h-px bg-[#C9A96E]" />
        </div>
        <h1
          className="text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300 }}
        >
          Temukan Parfum Idealmu
        </h1>
        <p className="text-[#8B7D72] mt-2 text-sm max-w-md mx-auto">
          Jawab 4 pertanyaan singkat — setiap jawaban dipakai untuk merekomendasikan parfum yang benar-benar sesuai denganmu.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {!done ? (
          <div>
            {/* Progress */}
            <div className="mb-10">
              <div className="flex items-center justify-between text-xs text-[#8B7D72] mb-2">
                <span>Pertanyaan {step + 1} dari {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}%</span>
              </div>
              <div className="h-px bg-[#E0D8CC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A96E] rounded-full transition-all duration-500"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex gap-2 mt-3 justify-center">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i < step   ? 'w-4 h-1.5 bg-[#C9A96E]' :
                      i === step ? 'w-6 h-1.5 bg-[#2C2520]' :
                                   'w-1.5 h-1.5 bg-[#E0D8CC]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-2">
              <h2
                className="text-[#2C2520]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 400 }}
              >
                {currentQuestion.question}
              </h2>
              {currentQuestion.helpText && (
                <p className="text-xs text-[#C9A96E] mt-1 tracking-wide">{currentQuestion.helpText}</p>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              {currentQuestion.options.map(opt => {
                const selected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`px-4 py-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                      selected
                        ? 'border-[#C9A96E] bg-[#C9A96E]/8 shadow-sm'
                        : 'border-[#E0D8CC] bg-white hover:border-[#C9A96E]/50'
                    }`}
                  >
                    <div
                      className="text-sm text-[#2C2520] mb-0.5"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 400 }}
                    >
                      {opt.label}
                    </div>
                    {opt.sub && (
                      <div className="text-[10px] text-[#8B7D72]">{opt.sub}</div>
                    )}
                    {selected && <div className="mt-2 w-3 h-3 rounded-full bg-[#C9A96E] ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Nav */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="text-sm text-[#8B7D72] hover:text-[#2C2520] transition-colors">
                  ← Kembali
                </button>
              ) : <div />}
              <button
                onClick={() => { if (step < totalSteps - 1) setStep(step + 1); else setDone(true); }}
                className="text-sm text-[#8B7D72] hover:text-[#2C2520] transition-colors"
              >
                Lewati →
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Result header */}
            <div className="text-center mb-8">
              <div className="w-10 h-px bg-[#C9A96E] mx-auto mb-4" />
              <h2
                className="text-[#2C2520] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 400 }}
              >
                Rekomendasi Untukmu
              </h2>
              <p className="text-[#5C5247] text-sm">
                {recommendations.length} parfum dipilih berdasarkan aroma, aktivitas, gaya hidup & budget-mu.
              </p>
              {answers.scent && (
                <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-[#C9A96E]/10 rounded-full text-sm text-[#C9A96E]">
                  Aroma pilihan: <strong>{scentDescriptions[answers.scent]}</strong>
                </div>
              )}
            </div>

            {/* Profil Aroma */}
            <div className="bg-[#F5F0E8] rounded-2xl p-5 mb-8">
              <h3 className="text-xs text-[#8B7D72] uppercase tracking-widest mb-3">Profil Aromamu</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([key, val]) => {
                  const q   = questions.find(q => q.id === key);
                  const opt = q?.options.find(o => o.value === val);
                  return opt ? (
                    <span key={key} className="text-xs px-3 py-1.5 bg-white rounded-full text-[#5C5247] border border-[#E0D8CC]">
                      {opt.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Product grid + match reason label */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {recommendations.map(product => (
                <div key={product.id} className="flex flex-col gap-1.5">
                  <ProductCard product={product} />
                  <div className="text-[10px] text-[#8B7D72] px-1 flex items-center gap-1">
                    <span className="text-[#C9A96E]">✓</span>
                    {getMatchReason(product, answers)}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/catalog"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2C2520] text-white rounded-full text-sm hover:bg-[#C9A96E] transition-colors"
              >
                Lihat Semua Katalog <ArrowRight size={15} />
              </Link>
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#E0D8CC] text-[#5C5247] rounded-full text-sm hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
              >
                <RotateCcw size={14} /> Ulangi Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}