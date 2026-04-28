import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Printer, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';

// ─── Data mock historis ───────────────────────────────────────────────────────
const bulananData = [
  { bulan: 'Nov 2025', pesanan: 14, revenue: 6200000,  decant: 7,  preloved: 3,  bnib: 4,  avgOrder: 442857 },
  { bulan: 'Des 2025', pesanan: 22, revenue: 9800000,  decant: 11, preloved: 5,  bnib: 6,  avgOrder: 445454 },
  { bulan: 'Jan 2026', pesanan: 17, revenue: 7400000,  decant: 9,  preloved: 4,  bnib: 4,  avgOrder: 435294 },
  { bulan: 'Feb 2026', pesanan: 20, revenue: 8900000,  decant: 10, preloved: 5,  bnib: 5,  avgOrder: 445000 },
  { bulan: 'Mar 2026', pesanan: 22, revenue: 10090000, decant: 12, preloved: 4,  bnib: 6,  avgOrder: 458636 },
  { bulan: 'Apr 2026', pesanan: 31, revenue: 14778000, decant: 15, preloved: 8,  bnib: 8,  avgOrder: 476710 },
];

const produkTerlaris = [
  { rank: 1,  name: 'Replica – Lazy Sunday Morning', brand: 'Maison Margiela', category: 'Decant',   qty: 48, revenue: 3240000,  tren: 'up'   },
  { rank: 2,  name: 'Sauvage EDP 100ml',             brand: 'Dior',            category: 'BNIB',     qty: 4,  revenue: 2890000,  tren: 'up'   },
  { rank: 3,  name: 'Blanche EDP',                   brand: 'Byredo',          category: 'Decant',   qty: 34, revenue: 2460000,  tren: 'same' },
  { rank: 4,  name: 'Oud Wood',                      brand: 'Tom Ford',        category: 'Decant',   qty: 26, revenue: 1980000,  tren: 'up'   },
  { rank: 5,  name: 'Eros EDT',                      brand: 'Versace',         category: 'BNIB',     qty: 3,  revenue: 1725000,  tren: 'down' },
  { rank: 6,  name: 'Black Opium EDP',               brand: 'YSL',             category: 'Preloved', qty: 6,  revenue: 1620000,  tren: 'up'   },
  { rank: 7,  name: 'Libre EDP',                     brand: 'YSL',             category: 'BNIB',     qty: 2,  revenue: 1340000,  tren: 'same' },
  { rank: 8,  name: 'Crystal Noir EDT',              brand: 'Versace',         category: 'Preloved', qty: 4,  revenue: 1180000,  tren: 'down' },
  { rank: 9,  name: 'La Vie Est Belle',              brand: 'Lancôme',         category: 'Preloved', qty: 3,  revenue: 990000,   tren: 'up'   },
  { rank: 10, name: 'Neroli Portofino',              brand: 'Tom Ford',        category: 'Decant',   qty: 18, revenue: 855000,   tren: 'same' },
];

const kategoriPerforma = [
  { name: 'Decant',   pesanan: 68, revenue: 9540000,  avgOrder: 140294, growth: '+18%', color: '#C9A96E' },
  { name: 'BNIB',     pesanan: 28, revenue: 7655000,  avgOrder: 273392, growth: '+24%', color: '#2C2520' },
  { name: 'Preloved', pesanan: 30, revenue: 3963000,  avgOrder: 132100, growth: '+11%', color: '#8B7D72' },
];

const harian14 = [
  { hari: '14/4', revenue: 430000  }, { hari: '15/4', revenue: 685000  },
  { hari: '16/4', revenue: 320000  }, { hari: '17/4', revenue: 940000  },
  { hari: '18/4', revenue: 1250000 }, { hari: '19/4', revenue: 760000  },
  { hari: '20/4', revenue: 480000  }, { hari: '21/4', revenue: 1100000 },
  { hari: '22/4', revenue: 890000  }, { hari: '23/4', revenue: 1420000 },
  { hari: '24/4', revenue: 650000  }, { hari: '25/4', revenue: 1680000 },
  { hari: '26/4', revenue: 770000  }, { hari: '27/4', revenue: 903000  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rp  = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const rpK = (n: number) =>
  n >= 1_000_000 ? `Rp ${(n / 1_000_000).toFixed(2)}jt` : `Rp ${(n / 1000).toFixed(0)}rb`;

function GrowthBadge({ tren }: { tren: string }) {
  if (tren === 'up')   return <span className="inline-flex items-center gap-0.5 text-green-600 text-xs"><TrendingUp size={11} /> Naik</span>;
  if (tren === 'down') return <span className="inline-flex items-center gap-0.5 text-red-500 text-xs"><TrendingDown size={11} /> Turun</span>;
  return <span className="inline-flex items-center gap-0.5 text-[#8B7D72] text-xs"><Minus size={11} /> Stabil</span>;
}

const catColor: Record<string, string> = {
  Decant:   'bg-[#EDE8DC] text-[#5C5247]',
  BNIB:     'bg-[#C9A96E]/15 text-[#8B6914]',
  Preloved: 'bg-[#3C3327]/10 text-[#3C3327]',
};

// ─── Pure-SVG Sparkline Area Chart (no recharts) ──────────────────────────────
function SparklineArea({ data }: { data: Array<{ hari: string; revenue: number }> }) {
  const W = 800, H = 180;
  const pad = { t: 8, r: 12, b: 32, l: 52 };
  const iW  = W - pad.l - pad.r;
  const iH  = H - pad.t - pad.b;
  const maxV = Math.max(...data.map(d => d.revenue));

  const px = (i: number)  => pad.l + (i / (data.length - 1)) * iW;
  const py = (v: number)  => pad.t + (1 - v / maxV) * iH;

  const linePts  = data.map((d, i) => `${px(i).toFixed(1)},${py(d.revenue).toFixed(1)}`).join(' ');
  const areaPts  = `${px(0).toFixed(1)},${(pad.t + iH).toFixed(1)} ${linePts} ${px(data.length - 1).toFixed(1)},${(pad.t + iH).toFixed(1)}`;

  // y-axis gridlines at 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
      {/* Grid */}
      {gridLevels.map(pct => {
        const gy = pad.t + (1 - pct) * iH;
        return (
          <g key={`grid-${pct}`}>
            <line x1={pad.l} y1={gy} x2={W - pad.r} y2={gy} stroke="#F0EBE1" strokeDasharray="3 3" strokeWidth={1} />
            <text x={pad.l - 6} y={gy + 4} textAnchor="end" fontSize={9} fill="#8B7D72">
              {(pct * maxV) >= 1000000
                ? `${((pct * maxV) / 1000000).toFixed(1)}jt`
                : `${((pct * maxV) / 1000).toFixed(0)}rb`}
            </text>
          </g>
        );
      })}
      {/* Area fill */}
      <polygon points={areaPts} fill="#C9A96E" fillOpacity={0.15} />
      {/* Line */}
      <polyline points={linePts} fill="none" stroke="#C9A96E" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots + tooltips */}
      {data.map((d, i) => (
        <g key={`pt-${i}`}>
          <circle cx={px(i)} cy={py(d.revenue)} r={3} fill="#C9A96E" />
          <title>{`${d.hari}: ${rp(d.revenue)}`}</title>
        </g>
      ))}
      {/* X-axis labels — every other */}
      {data.map((d, i) => i % 2 === 0 ? (
        <text key={`xl-${i}`} x={px(i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#8B7D72">
          {d.hari}
        </text>
      ) : null)}
    </svg>
  );
}

// ─── Recharts Bar Tooltip ─────────────────────────────────────────────────────
function TooltipBar({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E0D8CC] rounded-xl px-3 py-2 shadow-md text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="text-[#2C2520]">{rp(payload[0]?.value)}</div>
    </div>
  );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export function AdminRekap() {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<'bulanan' | 'produk' | 'kategori'>('bulanan');
  const printRef = useRef<HTMLDivElement>(null);

  const totalRevenue  = bulananData.reduce((s, b) => s + b.revenue, 0);
  const totalPesanan  = bulananData.reduce((s, b) => s + b.pesanan, 0);
  const avgOrderValue = Math.round(totalRevenue / totalPesanan);

  const apr = bulananData[5], mar = bulananData[4];
  const momGrowth = ((apr.revenue - mar.revenue) / mar.revenue * 100).toFixed(1);

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) { alert('Izinkan pop-up untuk mencetak.'); return; }
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8"/>
      <title>Rekap Penjualan — your.i scent</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:Georgia,serif;color:#2C2520;padding:32px;max-width:900px;margin:0 auto;font-size:12px;}
        h1{font-size:22px;font-weight:400;letter-spacing:.05em;margin-bottom:4px;}
        .sub{color:#8B7D72;font-size:10px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:24px;}
        table{width:100%;border-collapse:collapse;margin-bottom:24px;}
        thead{border-bottom:2px solid #2C2520;}
        th{text-align:left;padding:8px 10px;font-size:10px;color:#8B7D72;letter-spacing:.1em;text-transform:uppercase;font-weight:normal;}
        td{padding:7px 10px;border-bottom:1px solid #F0EBE1;color:#5C5247;}
        .gold{color:#C9A96E;} .section{margin-bottom:28px;}
        .section-title{font-size:13px;text-transform:uppercase;letter-spacing:.15em;color:#C9A96E;margin-bottom:10px;}
        @media print{body{padding:20px;}@page{margin:12mm;}}
      </style></head><body>
      <h1>Rekap Penjualan</h1>
      <div class="sub">your.i scent · Laporan per April 2026</div>
      <div class="section">
        <div class="section-title">Rekapan Bulanan</div>
        <table><thead><tr>
          <th>Bulan</th><th>Pesanan</th><th>Decant</th><th>Preloved</th><th>BNIB</th><th>Avg/Pesanan</th><th>Total Revenue</th>
        </tr></thead><tbody>
        ${bulananData.map(b => `<tr>
          <td>${b.bulan}</td><td>${b.pesanan}</td><td>${b.decant}</td>
          <td>${b.preloved}</td><td>${b.bnib}</td>
          <td>${rp(b.avgOrder)}</td><td class="gold">${rp(b.revenue)}</td>
        </tr>`).join('')}
        <tr style="font-weight:bold;">
          <td>TOTAL</td><td>${totalPesanan}</td>
          <td>${bulananData.reduce((s,b)=>s+b.decant,0)}</td>
          <td>${bulananData.reduce((s,b)=>s+b.preloved,0)}</td>
          <td>${bulananData.reduce((s,b)=>s+b.bnib,0)}</td>
          <td>${rp(avgOrderValue)}</td><td class="gold">${rp(totalRevenue)}</td>
        </tr>
        </tbody></table>
      </div>
      <div class="section">
        <div class="section-title">Top 10 Produk Terlaris</div>
        <table><thead><tr>
          <th>#</th><th>Produk</th><th>Brand</th><th>Kategori</th><th>Qty</th><th>Revenue</th>
        </tr></thead><tbody>
        ${produkTerlaris.map(p => `<tr>
          <td>${p.rank}</td><td>${p.name}</td><td>${p.brand}</td>
          <td>${p.category}</td><td>${p.qty}</td><td class="gold">${rp(p.revenue)}</td>
        </tr>`).join('')}
        </tbody></table>
      </div>
      <div class="section">
        <div class="section-title">Performa Kategori</div>
        <table><thead><tr>
          <th>Kategori</th><th>Pesanan</th><th>Revenue</th><th>Avg/Pesanan</th><th>Pertumbuhan</th>
        </tr></thead><tbody>
        ${kategoriPerforma.map(k => `<tr>
          <td>${k.name}</td><td>${k.pesanan}</td>
          <td class="gold">${rp(k.revenue)}</td>
          <td>${rp(k.avgOrder)}</td><td>${k.growth}</td>
        </tr>`).join('')}
        </tbody></table>
      </div>
      <script>window.onload=()=>window.print();</script>
      </body></html>`);
    win.document.close();
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} ref={printRef}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400 }}>
            Rekap Penjualan
          </h1>
          <p className="text-sm text-[#8B7D72] mt-0.5">Laporan kumulatif Nov 2025 – Apr 2026</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2C2520] text-white rounded-xl text-sm hover:bg-[#C9A96E] transition-colors"
        >
          <Printer size={15} />
          Cetak / Export PDF
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {([
          { label: 'Total Pendapatan', value: rpK(totalRevenue),   sub: '6 bulan terakhir', accent: true  },
          { label: 'Total Pesanan',    value: totalPesanan,         sub: `Avg ${Math.round(totalPesanan/6)}/bulan` },
          { label: 'Avg Order Value',  value: rpK(avgOrderValue),   sub: 'per transaksi'    },
          { label: 'Pertumbuhan MoM',  value: `+${momGrowth}%`,    sub: 'Apr vs Mar 2026', green: true   },
        ] as const).map(card => (
          <div
            key={card.label}
            className={`bg-white rounded-2xl border p-5 ${'accent' in card && card.accent ? 'border-[#C9A96E]/50' : 'border-[#E0D8CC]'}`}
          >
            <div className={`text-xl font-semibold mb-0.5 ${'green' in card && card.green ? 'text-green-600' : 'text-[#2C2520]'}`}>
              {card.value}
            </div>
            <div className="text-xs text-[#5C5247]">{card.label}</div>
            <div className="text-[10px] text-[#C0B8B0] mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Grafik Harian 14 Hari (pure SVG — no recharts) ── */}
      <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400 }}>
              Pendapatan 14 Hari Terakhir
            </h2>
            <p className="text-xs text-[#8B7D72] mt-0.5">14–27 April 2026</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#2C2520]">{rp(harian14.reduce((s, d) => s + d.revenue, 0))}</div>
            <div className="text-[10px] text-[#8B7D72]">total 14 hari</div>
          </div>
        </div>
        <SparklineArea data={harian14} />
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-1 bg-[#F5F0E8] rounded-xl p-1 mb-5 w-fit">
        {([
          { id: 'bulanan',  label: 'Rekapan Bulanan' },
          { id: 'produk',   label: 'Top Produk'      },
          { id: 'kategori', label: 'Per Kategori'    },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-white text-[#2C2520] shadow-sm' : 'text-[#8B7D72] hover:text-[#2C2520]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Rekapan Bulanan ── */}
      {activeTab === 'bulanan' && (
        <div className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden">
          <div className="p-5 border-b border-[#F0EBE1]">
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400 }}>
              Rekapan Bulanan
            </h2>
            <p className="text-xs text-[#8B7D72] mt-0.5">Breakdown pesanan dan pendapatan per bulan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF8F4]">
                <tr>
                  {['Bulan', 'Pesanan', 'Decant', 'Preloved', 'BNIB', 'Avg / Pesanan', 'Total Revenue', 'Grafik'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] text-[#8B7D72] uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bulananData.map((b, i) => {
                  const isLatest    = i === bulananData.length - 1;
                  const prev        = i > 0 ? bulananData[i - 1] : null;
                  const growthPct   = prev ? ((b.revenue - prev.revenue) / prev.revenue * 100) : null;
                  const maxRev      = Math.max(...bulananData.map(x => x.revenue));
                  return (
                    <tr key={b.bulan} className={`border-t border-[#F0EBE1] hover:bg-[#FAF8F4] transition-colors ${isLatest ? 'bg-[#FDFBF7]' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="text-sm text-[#2C2520]">{b.bulan}</div>
                        {growthPct !== null && (
                          <div className={`text-[10px] mt-0.5 ${growthPct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {growthPct >= 0 ? '+' : ''}{growthPct.toFixed(1)}% MoM
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#2C2520]">{b.pesanan}</td>
                      <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-full bg-[#EDE8DC] text-[#5C5247]">{b.decant}</span></td>
                      <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-full bg-[#3C3327]/10 text-[#3C3327]">{b.preloved}</span></td>
                      <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A96E]/15 text-[#8B6914]">{b.bnib}</span></td>
                      <td className="px-5 py-4 text-sm text-[#5C5247]">{rp(b.avgOrder)}</td>
                      <td className="px-5 py-4 text-sm text-[#2C2520]">{rp(b.revenue)}</td>
                      <td className="px-5 py-4">
                        <div className="w-24 h-2 bg-[#F5F0E8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(b.revenue / maxRev) * 100}%`, background: isLatest ? '#C9A96E' : '#E0D8CC' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#F5F0E8] border-t-2 border-[#E0D8CC]">
                <tr>
                  <td className="px-5 py-3 text-sm text-[#2C2520]">Total Keseluruhan</td>
                  <td className="px-5 py-3 text-sm text-[#2C2520]">{totalPesanan}</td>
                  <td className="px-5 py-3 text-sm text-[#5C5247]">{bulananData.reduce((s,b)=>s+b.decant,0)}</td>
                  <td className="px-5 py-3 text-sm text-[#5C5247]">{bulananData.reduce((s,b)=>s+b.preloved,0)}</td>
                  <td className="px-5 py-3 text-sm text-[#5C5247]">{bulananData.reduce((s,b)=>s+b.bnib,0)}</td>
                  <td className="px-5 py-3 text-sm text-[#5C5247]">{rp(avgOrderValue)}</td>
                  <td className="px-5 py-3 text-[#C9A96E]">{rp(totalRevenue)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Top Produk ── */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6">
            <h2 className="text-[#2C2520] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400 }}>
              Revenue per Produk
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={produkTerlaris.slice(0, 7)}
                layout="vertical"
                barSize={11}
                margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}jt` : `${v/1000}rb`}
                  tick={{ fontSize: 10, fill: '#8B7D72' }} axisLine={false} tickLine={false}
                />
                <YAxis
                  type="category" dataKey="name"
                  tick={{ fontSize: 10, fill: '#5C5247' }} axisLine={false} tickLine={false} width={155}
                />
                <Tooltip content={<TooltipBar />} cursor={{ fill: '#F5F0E8' }} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {produkTerlaris.slice(0, 7).map((_, i) => (
                    <Cell
                      key={`rekap-bar-${i}`}
                      fill={i === 0 ? '#C9A96E' : i === 1 ? '#A07040' : i === 2 ? '#CBAA72' : '#E0D8CC'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabel produk */}
          <div className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden">
            <div className="p-5 border-b border-[#F0EBE1]">
              <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400 }}>
                Top 10 Produk Terlaris
              </h2>
              <p className="text-xs text-[#8B7D72] mt-0.5">Kumulatif Nov 2025 – Apr 2026</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF8F4]">
                  <tr>
                    {['#', 'Produk', 'Brand', 'Kategori', 'Qty', 'Revenue', '% dari Total', 'Tren'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] text-[#8B7D72] uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {produkTerlaris.map(p => {
                    const totalRev = produkTerlaris.reduce((s, x) => s + x.revenue, 0);
                    const pct = ((p.revenue / totalRev) * 100).toFixed(1);
                    return (
                      <tr key={p.rank} className="border-t border-[#F0EBE1] hover:bg-[#FAF8F4] transition-colors">
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-semibold ${p.rank <= 3 ? 'text-[#C9A96E]' : 'text-[#C0B8B0]'}`}>
                            {p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank-1] : `#${p.rank}`}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[#2C2520]">{p.name}</td>
                        <td className="px-4 py-3.5 text-sm text-[#5C5247]">{p.brand}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${catColor[p.category]}`}>{p.category}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[#2C2520]">{p.qty}</td>
                        <td className="px-4 py-3.5 text-sm text-[#2C2520]">{rp(p.revenue)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#F5F0E8] rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-[#C9A96E]" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-[#8B7D72]">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><GrowthBadge tren={p.tren} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Per Kategori ── */}
      {activeTab === 'kategori' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kategoriPerforma.map(k => {
              const totalKatRev = kategoriPerforma.reduce((s, x) => s + x.revenue, 0);
              const pctRevenue  = ((k.revenue / totalKatRev) * 100).toFixed(0);
              return (
                <div key={k.name} className="bg-white rounded-2xl border border-[#E0D8CC] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${catColor[k.name]}`}>{k.name}</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{k.growth}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#8B7D72] uppercase tracking-wide mb-0.5">Revenue</div>
                      <div className="text-lg text-[#2C2520]">{rp(k.revenue)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] text-[#8B7D72]">Pesanan</div>
                        <div className="text-sm text-[#2C2520]">{k.pesanan}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#8B7D72]">Avg/Pesanan</div>
                        <div className="text-sm text-[#2C2520]">{rp(k.avgOrder)}</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#8B7D72] mb-1">
                        <span>Porsi Revenue</span><span>{pctRevenue}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F5F0E8] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pctRevenue}%`, background: k.color }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden">
            <div className="p-5 border-b border-[#F0EBE1]">
              <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400 }}>
                Perbandingan Kategori per Bulan
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF8F4]">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] text-[#8B7D72] uppercase tracking-widest">Bulan</th>
                    {['Decant', 'Preloved', 'BNIB'].map(c => (
                      <th key={c} className="text-left px-5 py-3 text-[10px] text-[#8B7D72] uppercase tracking-widest">{c}</th>
                    ))}
                    <th className="text-left px-5 py-3 text-[10px] text-[#8B7D72] uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bulananData.map(b => (
                    <tr key={b.bulan} className="border-t border-[#F0EBE1] hover:bg-[#FAF8F4] transition-colors">
                      <td className="px-5 py-3.5 text-sm text-[#2C2520]">{b.bulan}</td>
                      {([
                        { val: b.decant,   color: '#C9A96E' },
                        { val: b.preloved, color: '#8B7D72' },
                        { val: b.bnib,     color: '#2C2520' },
                      ] as const).map((col, ci) => (
                        <td key={ci} className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#2C2520]">{col.val}</span>
                            <div className="flex-1 h-1.5 bg-[#F5F0E8] rounded-full max-w-[60px] overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(col.val / b.pesanan) * 100}%`, background: col.color }} />
                            </div>
                          </div>
                        </td>
                      ))}
                      <td className="px-5 py-3.5 text-sm text-[#2C2520]">{b.pesanan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
