import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Package, ClipboardList, Tag, TrendingUp,
  ArrowUpRight, AlertTriangle, Banknote, ShoppingBag,
} from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { BRANDS } from '../../data/brands';
import { MOCK_ORDERS } from '../../data/orders';

// ─── Data historis mock — simulasi 8 minggu terakhir ──────────────────────────
const weeklyRevenue = [
  { week: 'W1 Mar', pendapatan: 1850000, pesanan: 4 },
  { week: 'W2 Mar', pendapatan: 2340000, pesanan: 5 },
  { week: 'W3 Mar', pendapatan: 3120000, pesanan: 7 },
  { week: 'W4 Mar', pendapatan: 2780000, pesanan: 6 },
  { week: 'W1 Apr', pendapatan: 4050000, pesanan: 9 },
  { week: 'W2 Apr', pendapatan: 3600000, pesanan: 8 },
  { week: 'W3 Apr', pendapatan: 5280000, pesanan: 11 },
  { week: 'W4 Apr', pendapatan: 1848000, pesanan: 3 },
];

const monthlyRevenue = [
  { month: 'Nov', pendapatan: 6200000, pesanan: 14 },
  { month: 'Des', pendapatan: 9800000, pesanan: 22 },
  { month: 'Jan', pendapatan: 7400000, pesanan: 17 },
  { month: 'Feb', pendapatan: 8900000, pesanan: 20 },
  { month: 'Mar', pendapatan: 10090000, pesanan: 22 },
  { month: 'Apr', pendapatan: 14778000, pesanan: 31 },
];

// ─── Top 5 produk terlaris (mock) ─────────────────────────────────────────────
const topProducts = [
  { name: 'Lazy Sunday Morning', brand: 'Maison Margiela', revenue: 3240000, qty: 18 },
  { name: 'Sauvage EDP', brand: 'Dior', revenue: 2890000, qty: 4 },
  { name: 'Blanche EDP', brand: 'Byredo', revenue: 2460000, qty: 12 },
  { name: 'Oud Wood', brand: 'Tom Ford', revenue: 1980000, qty: 9 },
  { name: 'Eros EDT', brand: 'Versace', revenue: 1725000, qty: 3 },
];

// ─── Distribusi kategori pesanan ──────────────────────────────────────────────
const categoryDist = [
  { name: 'Decant',   value: 48, color: '#C9A96E' },
  { name: 'BNIB',     value: 31, color: '#2C2520' },
  { name: 'Preloved', value: 21, color: '#8B7D72' },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

function TooltipRevenue({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E0D8CC] rounded-xl px-4 py-3 shadow-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="text-xs text-[#8B7D72] mb-1">{label}</div>
      <div className="text-sm text-[#2C2520]">{rp(payload[0]?.value)}</div>
      <div className="text-xs text-[#C9A96E]">{payload[1]?.value} pesanan</div>
    </div>
  );
}

function TooltipBar({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E0D8CC] rounded-xl px-4 py-3 shadow-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="text-sm text-[#2C2520]">{rp(payload[0]?.value)}</div>
    </div>
  );
}

// ─── Komponen utama ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const { products } = useProducts();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock   = products.filter(p => p.stock > 0 && p.stock <= 3);
  const totalRevenue = MOCK_ORDERS.filter(o => o.status === 'selesai').reduce((s, o) => s + o.total, 0);
  const pending  = MOCK_ORDERS.filter(o => o.status === 'pending').length;
  const selesai  = MOCK_ORDERS.filter(o => o.status === 'selesai').length;

  const chartData = period === 'weekly' ? weeklyRevenue : monthlyRevenue;
  const xKey      = period === 'weekly' ? 'week' : 'month';

  const statCards = [
    {
      title: 'Total Pendapatan',
      value: rp(totalRevenue),
      sub: `${selesai} pesanan selesai`,
      icon: Banknote,
      color: 'bg-[#C9A96E]/10 text-[#8B6914]',
      link: '/admin/orders',
      accent: true,
    },
    {
      title: 'Total Pesanan',
      value: MOCK_ORDERS.length,
      sub: `${pending} pending`,
      icon: ClipboardList,
      color: 'bg-green-50 text-green-600',
      link: '/admin/orders',
    },
    {
      title: 'Total Produk',
      value: products.length,
      sub: `${BRANDS.length} brand`,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/products',
    },
    {
      title: 'Stok Bermasalah',
      value: outOfStock.length + lowStock.length,
      sub: `${outOfStock.length} habis · ${lowStock.length} hampir habis`,
      icon: AlertTriangle,
      color: outOfStock.length > 0 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500',
      link: '/admin/products',
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400 }}>
            Dashboard
          </h1>
          <p className="text-sm text-[#8B7D72] mt-0.5">Selamat datang di Admin Panel your.i scent</p>
        </div>
        <div className="text-xs text-[#8B7D72] bg-[#F5F0E8] px-3 py-1.5 rounded-full">
          April 2026
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {statCards.map(card => (
          <Link
            key={card.title}
            to={card.link}
            className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all group ${card.accent ? 'border-[#C9A96E]/40' : 'border-[#E0D8CC]'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
              <ArrowUpRight size={14} className="text-[#C0B8B0] group-hover:text-[#C9A96E] transition-colors" />
            </div>
            <div className="text-xl font-semibold text-[#2C2520] leading-tight">{card.value}</div>
            <div className="text-xs text-[#8B7D72] mt-0.5">{card.title}</div>
            <div className="text-[10px] text-[#C0B8B0] mt-1">{card.sub}</div>
          </Link>
        ))}
      </div>

      {/* ── Revenue Chart ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 400 }}>
              Tren Pendapatan
            </h2>
            <p className="text-xs text-[#8B7D72] mt-0.5">Pendapatan dari pesanan selesai</p>
          </div>
          <div className="flex bg-[#F5F0E8] rounded-xl p-1 gap-1">
            {(['weekly', 'monthly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${period === p ? 'bg-white text-[#2C2520] shadow-sm' : 'text-[#8B7D72] hover:text-[#2C2520]'}`}
              >
                {p === 'weekly' ? 'Mingguan' : 'Bulanan'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#8B7D72' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}jt` : `${v / 1000}rb`}
              tick={{ fontSize: 10, fill: '#8B7D72' }} axisLine={false} tickLine={false} width={48}
            />
            <Tooltip content={<TooltipRevenue />} />
            <Area type="monotone" dataKey="pendapatan" stroke="#C9A96E" strokeWidth={2.5}
              fill="#C9A96E" fillOpacity={0.18} dot={{ fill: '#C9A96E', r: 3 }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="pesanan" stroke="#2C2520" strokeWidth={1.5}
              fill="#2C2520" fillOpacity={0.06} dot={false} strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 justify-center">
          {[{ color: '#C9A96E', label: 'Pendapatan (Rp)' }, { color: '#2C2520', label: 'Jumlah Pesanan', dashed: true }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 rounded-full flex-shrink-0" style={{ background: l.color, borderTop: l.dashed ? '2px dashed' : undefined }} />
              <span className="text-[11px] text-[#8B7D72]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 3: Bar Chart + Pie Chart ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Top Produk (Bar) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0D8CC] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 400 }}>
              Top 5 Produk Terlaris
            </h2>
            <span className="text-[10px] text-[#8B7D72] bg-[#F5F0E8] px-2 py-1 rounded-full">berdasarkan revenue</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}jt` : `${v / 1000}rb`}
                tick={{ fontSize: 10, fill: '#8B7D72' }} axisLine={false} tickLine={false}
              />
              <YAxis
                type="category" dataKey="name"
                tick={{ fontSize: 11, fill: '#5C5247' }} axisLine={false} tickLine={false}
                width={130}
              />
              <Tooltip content={<TooltipBar />} cursor={{ fill: '#F5F0E8' }} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {topProducts.map((_, i) => (
                  <Cell key={`dash-bar-${i}`} fill={i === 0 ? '#C9A96E' : i === 1 ? '#A07040' : '#E0D8CC'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Top 3 badges */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {topProducts.slice(0, 3).map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 bg-[#FAF8F4] rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] font-semibold" style={{ color: ['#C9A96E', '#A07040', '#8B7D72'][i] }}>
                  #{i + 1}
                </span>
                <div>
                  <div className="text-[11px] text-[#2C2520] truncate max-w-[100px]">{p.name}</div>
                  <div className="text-[10px] text-[#8B7D72]">{p.qty} terjual</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribusi Kategori (Pie) */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 flex flex-col">
          <h2 className="text-[#2C2520] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 400 }}>
            Kategori Pesanan
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categoryDist}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryDist.map((entry, i) => (
                    <Cell key={`dash-pie-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [`${v}%`, '']}
                  contentStyle={{ fontFamily: 'Inter, sans-serif', fontSize: 12, border: '1px solid #E0D8CC', borderRadius: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-2">
            {categoryDist.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <span className="text-sm text-[#5C5247]">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#F5F0E8] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.value}%`, background: cat.color }} />
                  </div>
                  <span className="text-sm text-[#2C2520] w-8 text-right">{cat.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Recent Orders + Stok ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0D8CC] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 400 }}>
              Pesanan Terbaru
            </h2>
            <Link to="/admin/orders" className="text-xs text-[#C9A96E] hover:underline">Lihat Semua →</Link>
          </div>
          <div className="space-y-2.5">
            {MOCK_ORDERS.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center gap-3 p-3 bg-[#FAF8F4] rounded-xl hover:bg-[#F0EBE1] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${order.status === 'selesai' ? 'bg-green-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#2C2520] truncate">{order.customerName}</div>
                  <div className="text-[11px] text-[#8B7D72]">
                    <span className="font-mono text-[10px] mr-1">{order.id}</span>· {order.items.length} item
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-[#2C2520]">Rp {order.total.toLocaleString('id-ID')}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.status === 'selesai' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: Stok + Status */}
        <div className="space-y-4">

          {/* Ringkasan Status */}
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-5">
            <h2 className="text-[#2C2520] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 400 }}>
              Ringkasan Toko
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Pending', val: pending,  dot: 'bg-amber-400'  },
                { label: 'Selesai', val: selesai,  dot: 'bg-green-500'  },
                { label: 'Brand',   val: BRANDS.length, dot: 'bg-blue-400'  },
                { label: 'Featured', val: products.filter(p => p.featured).length, dot: 'bg-[#C9A96E]' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#5C5247]">
                    <div className={`w-2 h-2 rounded-full ${r.dot}`} />
                    {r.label}
                  </div>
                  <span className="text-sm text-[#2C2520]">{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stok Alert */}
          {(outOfStock.length > 0 || lowStock.length > 0) && (
            <div className="bg-white rounded-2xl border border-[#E0D8CC] p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-amber-500" />
                <h2 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 400 }}>
                  Perlu Perhatian
                </h2>
              </div>
              <div className="space-y-2">
                {[...outOfStock, ...lowStock].slice(0, 5).map(p => (
                  <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${p.stock === 0 ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <div className="min-w-0">
                      <div className="text-xs text-[#2C2520] truncate max-w-[120px]">{p.name}</div>
                      <div className="text-[10px] text-[#8B7D72]">{p.brand}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {p.stock === 0 ? 'Habis' : `Sisa ${p.stock}`}
                    </span>
                  </div>
                ))}
                <Link to="/admin/products" className="block text-center text-[11px] text-[#C9A96E] hover:underline mt-1">
                  Kelola Stok →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}