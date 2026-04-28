// ─── AdminQuizSettings — halaman utama pengaturan quiz ───────────────────────
//  Dibagi jadi 3 tab + 1 file shared:
//    ScentTab.tsx   → kelola tipe aroma
//    ActivityTab.tsx → kelola aktivitas
//    StyleTab.tsx   → kelola kepribadian
//    Shared.tsx     → komponen & konstanta bersama
// ──────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Save, RotateCcw, Info, Droplets, Activity, Smile } from 'lucide-react';
import {
  QuizConfig,
  loadQuizConfig,
  saveQuizConfig,
  resetQuizConfig,
} from '../../../data/quizConfig';
import { ScentTab }    from './ScentTab';
import { ActivityTab } from './ActivityTab';
import { StyleTab }    from './StyleTab';

type Tab = 'scent' | 'activity' | 'style';

export function AdminQuizSettings() {
  const [config, setConfig]   = useState<QuizConfig>(() => loadQuizConfig());
  const [activeTab, setTab]   = useState<Tab>('scent');
  const [saved, setSaved]     = useState(false);
  const [showReset, setReset] = useState(false);

  // ── Helpers update per-section ───────────────────────────────────────────
  const updateScents     = (list: QuizConfig['scentTypes'])  => { setConfig(c => ({ ...c, scentTypes: list }));  setSaved(false); };
  const updateActivities = (list: QuizConfig['activities'])  => { setConfig(c => ({ ...c, activities: list }));  setSaved(false); };
  const updateStyles     = (list: QuizConfig['styles'])      => { setConfig(c => ({ ...c, styles: list }));      setSaved(false); };

  // ── Simpan ───────────────────────────────────────────────────────────────
  const handleSave = () => {
    saveQuizConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    resetQuizConfig();
    setConfig(loadQuizConfig());
    setReset(false);
    setSaved(false);
  };

  // ── Tab items ────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'scent',     label: 'Tipe Aroma',  count: config.scentTypes.length  },
    { id: 'activity',  label: 'Aktivitas',   count: config.activities.length  },
    { id: 'style',   label: 'Kepribadian', count: config.styles.length      },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-[#2C2520]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400 }}
          >
            Pengaturan Quiz
          </h2>
          <p className="text-[#8B7D72] text-sm mt-0.5">
            Kelola tipe aroma, aktivitas, dan kepribadian yang muncul di quiz pengguna
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setReset(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0D8CC] text-sm text-[#8B7D72] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
          >
            <RotateCcw size={14} /> Reset Default
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white transition-all ${
              saved ? 'bg-green-500' : 'bg-[#2C2520] hover:bg-[#C9A96E]'
            }`}
          >
            <Save size={14} /> {saved ? 'Tersimpan ✓' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/30 rounded-2xl p-4 mb-6 flex gap-3">
        <Info size={16} className="text-[#C9A96E] mt-0.5 shrink-0" />
        <div className="text-sm text-[#5C5247]">
          <span className="text-[#2C2520]">Cara kerja:</span> Semua yang kamu atur di sini langsung
          muncul sebagai pilihan di quiz pengguna. Tekan{' '}
          <strong className="text-[#2C2520]">Simpan</strong> agar perubahan aktif.
        </div>
      </div>

      {/* ── Skor bobot ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Aroma utama cocok', poin: '+40', sub: 'Dari jawaban Q1',  gold: false },
          { label: 'Aktivitas cocok',   poin: '+25', sub: 'Diatur di tab ini', gold: true  },
          { label: 'Intensity sesuai',  poin: '+15', sub: 'Range di tab ini',  gold: true  },
          { label: 'Kepribadian cocok', poin: '+20', sub: 'Diatur di tab ini', gold: true  },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-[#E0D8CC] p-3 text-center">
            <div
              style={{
                color: item.gold ? '#C9A96E' : '#2C2520',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
              }}
            >
              {item.poin}
            </div>
            <div className="text-[11px] text-[#2C2520] mt-0.5">{item.label}</div>
            <div className="text-[10px] text-[#8B7D72] mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-[#EDE8DF] rounded-xl p-1 mb-6 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#2C2520] shadow-sm'
                : 'text-[#8B7D72] hover:text-[#2C2520]'
            }`}
          >
            {tab.label}
            <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-[10px] px-1.5 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'scent' && (
        <ScentTab
          scentTypes={config.scentTypes}
          onUpdate={updateScents}
        />
      )}
      {activeTab === 'activity' && (
        <ActivityTab
          activities={config.activities}
          scentTypes={config.scentTypes}
          onUpdate={updateActivities}
        />
      )}
      {activeTab === 'style' && (
        <StyleTab
          styles={config.styles}
          scentTypes={config.scentTypes}
          onUpdate={updateStyles}
        />
      )}

      {/* ── Simpan bawah ── */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm text-white transition-all ${
            saved ? 'bg-green-500' : 'bg-[#2C2520] hover:bg-[#C9A96E]'
          }`}
        >
          <Save size={14} /> {saved ? 'Tersimpan ✓' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* ── Modal reset ── */}
      {showReset && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <RotateCcw size={18} className="text-[#C9A96E]" />
              <h3
                className="text-[#2C2520]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
              >
                Reset ke Default?
              </h3>
            </div>
            <p className="text-sm text-[#5C5247] mb-5">
              Semua perubahan akan dikembalikan ke pengaturan awal bawaan sistem.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setReset(false)}
                className="flex-1 py-2 rounded-full border border-[#E0D8CC] text-sm text-[#5C5247] hover:border-[#C9A96E] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-full bg-[#2C2520] text-white text-sm hover:bg-[#C9A96E] transition-colors"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
