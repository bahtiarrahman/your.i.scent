import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Star, ChevronDown, ArrowRight, X, Check, Bell, User, Menu } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   your.i scent — UI Design System
   Route: /design-system  (tersembunyi dari navbar, khusus dokumentasi)
   Export: Ctrl+P → Save as PDF → import ke Figma via plugin "PDF to Figma"
───────────────────────────────────────────────────────────────────────────── */

// ── Token definitions ─────────────────────────────────────────────────────────
const COLORS = {
  primary: [
    { name: 'Primary 900', hex: '#1A1410', use: 'Extra dark / deepest text' },
    { name: 'Primary 800', hex: '#2C2520', use: 'Main dark — heading, navbar bg' },
    { name: 'Primary 700', hex: '#3C3327', use: 'Secondary dark — body on dark' },
    { name: 'Primary 600', hex: '#4D4237', use: 'Hover state on dark bg' },
    { name: 'Primary 500', hex: '#5C5247', use: 'Body text default' },
    { name: 'Primary 400', hex: '#7A6B5E', use: 'Placeholder / muted text' },
    { name: 'Primary 300', hex: '#8B7D72', use: 'Secondary muted text' },
    { name: 'Primary 200', hex: '#B0A49A', use: 'Disabled / very muted' },
  ],
  accent: [
    { name: 'Gold 900', hex: '#6B5010', use: 'Gold darkest' },
    { name: 'Gold 700', hex: '#8B6914', use: 'Gold dark' },
    { name: 'Gold 500', hex: '#C9A96E', use: 'Primary gold — CTA, accent' },
    { name: 'Gold 400', hex: '#D4BA8A', use: 'Gold mid' },
    { name: 'Gold 300', hex: '#DFC9A0', use: 'Gold light' },
    { name: 'Gold 100', hex: '#F5EDD8', use: 'Gold tint bg' },
    { name: 'Gold 50',  hex: '#FBF6EC', use: 'Gold ultra-light bg' },
  ],
  neutral: [
    { name: 'Cream 50',  hex: '#FFFFFF', use: 'Card / Modal background' },
    { name: 'Cream 100', hex: '#FAF8F4', use: 'Page background (root)' },
    { name: 'Cream 200', hex: '#F5F0E8', use: 'Section / card bg subtle' },
    { name: 'Cream 300', hex: '#EDE8DC', use: 'Tag / badge bg' },
    { name: 'Cream 400', hex: '#E0D8CC', use: 'Border / divider' },
    { name: 'Cream 500', hex: '#CCC3B5', use: 'Disabled border' },
    { name: 'Cream 600', hex: '#B0A49A', use: 'Faded text on light bg' },
  ],
  scent: [
    { name: 'Fresh',    hex: '#4AACBF', sub: '#EAF6F9', use: 'Fresh & Citrusy notes' },
    { name: 'Floral',   hex: '#D4819A', sub: '#FBF0F4', use: 'Floral & Rosy notes' },
    { name: 'Woody',    hex: '#A07040', sub: '#F5EDE0', use: 'Woody & Earthy notes' },
    { name: 'Sweet',    hex: '#C89830', sub: '#FDF5E0', use: 'Sweet & Gourmand notes' },
    { name: 'Citrus',   hex: '#D88030', sub: '#FEF3E4', use: 'Citrus & Fruity notes' },
    { name: 'Oriental', hex: '#8B5EAB', sub: '#F0EBF8', use: 'Oriental & Musk notes' },
  ],
};

const TYPOGRAPHY = [
  { role: 'Display',     font: 'Cormorant Garamond', size: '48–64px', weight: 300, sample: 'your.i scent', desc: 'Hero headline, brand title' },
  { role: 'H1',          font: 'Cormorant Garamond', size: '36–48px', weight: 400, sample: 'Koleksi Premium', desc: 'Page title, section hero' },
  { role: 'H2',          font: 'Cormorant Garamond', size: '28–36px', weight: 400, sample: 'Produk Unggulan', desc: 'Section heading' },
  { role: 'H3',          font: 'Cormorant Garamond', size: '20–28px', weight: 400, sample: 'Dior Sauvage EDP', desc: 'Card title, product name' },
  { role: 'Body Large',  font: 'Inter',               size: '16px',    weight: 400, sample: 'Parfum premium untuk sehari-hari dengan karakter yang kuat dan tahan lama.', desc: 'Description, paragraph' },
  { role: 'Body',        font: 'Inter',               size: '14px',    weight: 400, sample: 'Tersedia dalam 2ml, 5ml, dan 10ml decant untuk trial experience.', desc: 'Default body text' },
  { role: 'Label',       font: 'Inter',               size: '12px',    weight: 500, sample: 'JENIS AROMA · DECANT', desc: 'Uppercase label, badge text' },
  { role: 'Caption',     font: 'Inter',               size: '10–11px', weight: 400, sample: 'Top Notes: Bergamot, Lemon', desc: 'Notes, caption, hint text' },
];

const SPACING = [
  { token: 'xs',   px: 4,   use: 'Icon gap, badge padding' },
  { token: 'sm',   px: 8,   use: 'Inline padding, tag spacing' },
  { token: 'md',   px: 12,  use: 'Button padding-y, input padding' },
  { token: 'lg',   px: 16,  use: 'Card padding, section gap' },
  { token: 'xl',   px: 20,  use: 'Button padding-x, list item gap' },
  { token: '2xl',  px: 24,  use: 'Section padding, modal padding' },
  { token: '3xl',  px: 32,  use: 'Vertical section gap' },
  { token: '4xl',  px: 48,  use: 'Section margin, hero padding' },
  { token: '5xl',  px: 64,  use: 'Page section gap' },
  { token: '6xl',  px: 80,  use: 'Hero padding, large section' },
];

const RADIUS = [
  { token: 'sm',   value: '6px',   use: 'Badge, tag, small input' },
  { token: 'md',   value: '8px',   use: 'Input field, small button' },
  { token: 'lg',   value: '12px',  use: 'Card, modal, panel' },
  { token: 'xl',   value: '16px',  use: 'Large card, drawer' },
  { token: '2xl',  value: '20px',  use: 'Product card, featured section' },
  { token: 'full', value: '9999px',use: 'Pill button, circular badge' },
];

// ── Section label component ───────────────────────────────────────────────────
function SectionTitle({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 pb-4 border-b border-[#E0D8CC]">
      <div className="flex items-baseline gap-3">
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: '#C9A96E', letterSpacing: '0.15em' }}>
          {number}
        </span>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400, color: '#2C2520' }}>
          {title}
        </h2>
      </div>
      {subtitle && <p style={{ color: '#8B7D72', fontSize: '13px', marginTop: '4px' }}>{subtitle}</p>}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[#C9A96E]/10 text-[#8B6914]" style={{ fontFamily: 'Inter' }}>
      {children}
    </span>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function DesignSystemPage() {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#FAF8F4', minHeight: '100vh', color: '#2C2520' }}>
      {/* ── Cover ──────────────────────────────────────────────────────────── */}
      <div className="print:break-after-page" style={{ background: '#2C2520', padding: '80px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative rings */}
        {[320, 480, 640].map(s => (
          <div key={s} style={{
            position: 'absolute', right: -s / 3, top: '50%', transform: 'translateY(-50%)',
            width: s, height: s, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.12)',
            pointerEvents: 'none',
          }} />
        ))}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '32px', height: '1px', background: '#C9A96E' }} />
            <span style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>UI Design System</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 300, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '16px' }}>
            your.i scent
          </h1>
          <p style={{ color: '#8B7D72', fontSize: '15px', maxWidth: '480px', lineHeight: 1.6, marginBottom: '40px' }}>
            Design language, color tokens, typography scale, components & spacing sistem untuk website e-commerce parfum premium.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Color System', 'Typography', 'Buttons', 'Components', 'Spacing', 'Icons'].map(t => (
              <span key={t} style={{ color: '#5C5247', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C9A96E', display: 'inline-block' }} />
                {t}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[['Version', 'v1.0'], ['Platform', 'React + Tailwind CSS v4'], ['Date', 'April 2026'], ['Author', 'your.i scent']].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '10px', color: '#5C5247', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>{k}</div>
                <div style={{ fontSize: '13px', color: '#C9A96E' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 32px' }}>

        {/* ── 01 COLOR SYSTEM ──────────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="01" title="Color System" subtitle="Palet warna unisex berbasis cream/beige, charcoal brown, dan gold aksen" />

          {/* Primary */}
          <div className="mb-8">
            <p className="mb-3" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72' }}>Primary — Brown / Charcoal</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {COLORS.primary.map(c => (
                <div key={c.hex}>
                  <div style={{ height: '64px', background: c.hex, borderRadius: '8px', marginBottom: '6px', border: c.hex === '#FFFFFF' ? '1px solid #E0D8CC' : 'none' }} />
                  <div style={{ fontSize: '10px', color: '#5C5247', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600, color: '#2C2520' }}>{c.name.split(' ')[1]}</div>
                    <div style={{ fontFamily: 'monospace', color: '#8B7D72' }}>{c.hex}</div>
                    <div style={{ color: '#B0A49A' }}>{c.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Gold */}
          <div className="mb-8">
            <p className="mb-3" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72' }}>Accent — Gold</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {COLORS.accent.map(c => (
                <div key={c.hex}>
                  <div style={{ height: '64px', background: c.hex, borderRadius: '8px', marginBottom: '6px' }} />
                  <div style={{ fontSize: '10px', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600, color: '#2C2520' }}>{c.name.split(' ')[1]}</div>
                    <div style={{ fontFamily: 'monospace', color: '#8B7D72' }}>{c.hex}</div>
                    <div style={{ color: '#B0A49A' }}>{c.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral Cream */}
          <div className="mb-8">
            <p className="mb-3" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72' }}>Neutral — Cream / Beige</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {COLORS.neutral.map(c => (
                <div key={c.hex}>
                  <div style={{ height: '64px', background: c.hex, borderRadius: '8px', marginBottom: '6px', border: '1px solid #E0D8CC' }} />
                  <div style={{ fontSize: '10px', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600, color: '#2C2520' }}>{c.name.split(' ')[1]}</div>
                    <div style={{ fontFamily: 'monospace', color: '#8B7D72' }}>{c.hex}</div>
                    <div style={{ color: '#B0A49A' }}>{c.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scent Semantic */}
          <div>
            <p className="mb-3" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72' }}>Semantic — Scent Category</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {COLORS.scent.map(c => (
                <div key={c.name} style={{ background: c.sub, borderRadius: '12px', padding: '12px', border: `2px solid ${c.hex}30` }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.hex, marginBottom: '8px' }} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#2C2520', marginBottom: '2px' }}>{c.name}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#8B7D72', marginBottom: '2px' }}>{c.hex}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#B0A49A' }}>{c.sub}</div>
                  <div style={{ fontSize: '9px', color: '#8B7D72', marginTop: '4px' }}>{c.use}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 02 TYPOGRAPHY ────────────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="02" title="Typography" subtitle="Cormorant Garamond (serif) untuk heading elegan + Inter (sans-serif) untuk body clean" />

          {/* Font families */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div style={{ background: '#2C2520', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '12px' }}>Display / Heading</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: 300, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '8px' }}>Cormorant</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: 300, color: '#C9A96E', lineHeight: 1.1, marginBottom: '16px' }}>Garamond</div>
              <div style={{ fontSize: '11px', color: '#5C5247' }}>Serif · Google Fonts · Weight 300, 400, 500</div>
            </div>
            <div style={{ background: '#F5F0E8', borderRadius: '16px', padding: '24px', border: '1px solid #E0D8CC' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '12px' }}>Body / UI</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '40px', fontWeight: 300, color: '#2C2520', lineHeight: 1.1, marginBottom: '8px' }}>Inter</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '40px', fontWeight: 700, color: '#5C5247', lineHeight: 1.1, marginBottom: '16px' }}>Regular</div>
              <div style={{ fontSize: '11px', color: '#8B7D72' }}>Sans-serif · Google Fonts · Weight 300–700</div>
            </div>
          </div>

          {/* Type scale */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 80px', padding: '10px 16px', background: '#F5F0E8', fontSize: '10px', color: '#8B7D72', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <span>Role</span><span>Sample</span><span>Font / Size</span><span>Weight</span>
            </div>
            {TYPOGRAPHY.map((t, i) => (
              <div key={t.role} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 80px', padding: '14px 16px', borderTop: i === 0 ? 'none' : '1px solid #F0EBE1', alignItems: 'center', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#2C2520' }}>{t.role}</div>
                  <div style={{ fontSize: '9px', color: '#B0A49A', marginTop: '2px' }}>{t.desc}</div>
                </div>
                <div style={{
                  fontFamily: t.font === 'Cormorant Garamond' ? "'Cormorant Garamond', serif" : 'Inter, sans-serif',
                  fontSize: t.role.includes('Display') ? '36px' : t.role === 'H1' ? '28px' : t.role === 'H2' ? '22px' : t.role === 'H3' ? '18px' : t.role === 'Body Large' ? '15px' : t.role === 'Body' ? '13px' : t.role === 'Label' ? '11px' : '10px',
                  fontWeight: t.weight,
                  color: '#2C2520',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  letterSpacing: t.role === 'Label' ? '0.12em' : 'normal',
                  textTransform: t.role === 'Label' ? 'uppercase' : 'none',
                }}>{t.sample}</div>
                <div style={{ fontSize: '10px', color: '#8B7D72' }}>
                  <div style={{ fontFamily: 'monospace' }}>{t.font === 'Cormorant Garamond' ? 'Cormorant' : 'Inter'}</div>
                  <div style={{ color: '#C9A96E' }}>{t.size}</div>
                </div>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#8B7D72' }}>{t.weight}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 BUTTON SYSTEM ─────────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="03" title="Button System" subtitle="Tiga varian utama + pill rounded — semua menggunakan Inter, transisi 200ms ease" />

          {/* Button variants grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Primary */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '14px' }}>Primary Button</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                <button style={{ padding: '10px 24px', background: '#2C2520', color: '#FFFFFF', borderRadius: '9999px', border: 'none', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Beli Sekarang <ArrowRight size={14} />
                </button>
                <button style={{ padding: '10px 24px', background: '#C9A96E', color: '#FFFFFF', borderRadius: '9999px', border: 'none', fontSize: '13px', cursor: 'pointer' }}>
                  Hover State
                </button>
                <button style={{ padding: '10px 24px', background: '#B8966A', color: '#FFFFFF', borderRadius: '9999px', border: 'none', fontSize: '13px', cursor: 'pointer' }}>
                  Active / Pressed
                </button>
                <button style={{ padding: '10px 24px', background: '#E0D8CC', color: '#B0A49A', borderRadius: '9999px', border: 'none', fontSize: '13px', cursor: 'not-allowed' }} disabled>
                  Disabled
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '10px', color: '#8B7D72' }}>
                {[
                  ['Default', '#2C2520 bg', 'White text'],
                  ['Hover', '#C9A96E bg', 'White text'],
                  ['Active', '#B8966A bg', 'White text'],
                  ['Disabled', '#E0D8CC bg', '#B0A49A text'],
                ].map(([s, b, t]) => (
                  <div key={s} style={{ background: '#F5F0E8', borderRadius: '8px', padding: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#2C2520', marginBottom: '2px' }}>{s}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px' }}>{b}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px' }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '14px' }}>Secondary / Outlined Button</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                <button style={{ padding: '10px 24px', background: 'transparent', color: '#2C2520', borderRadius: '9999px', border: '1.5px solid #E0D8CC', fontSize: '13px', cursor: 'pointer' }}>
                  Lihat Detail
                </button>
                <button style={{ padding: '10px 24px', background: 'transparent', color: '#C9A96E', borderRadius: '9999px', border: '1.5px solid #C9A96E', fontSize: '13px', cursor: 'pointer' }}>
                  Hover State
                </button>
                <button style={{ padding: '9px 23px', background: '#C9A96E/10', color: '#8B6914', borderRadius: '9999px', border: '1.5px solid #C9A96E', fontSize: '13px', cursor: 'pointer', backgroundColor: 'rgba(201,169,110,0.1)' }}>
                  Active
                </button>
                <button style={{ padding: '10px 24px', background: 'transparent', color: '#B0A49A', borderRadius: '9999px', border: '1.5px solid #E0D8CC', fontSize: '13px', cursor: 'not-allowed' }} disabled>
                  Disabled
                </button>
              </div>
            </div>

            {/* Ghost / Text */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '14px' }}>Ghost / Text Button</div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button style={{ padding: '8px 0', background: 'none', border: 'none', color: '#5C5247', fontSize: '13px', cursor: 'pointer' }}>
                  Lihat Semua →
                </button>
                <button style={{ padding: '8px 0', background: 'none', border: 'none', color: '#C9A96E', fontSize: '13px', cursor: 'pointer' }}>
                  Hover State →
                </button>
                <button style={{ padding: '8px 12px', background: '#F5F0E8', border: 'none', color: '#2C2520', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  Ghost Fill
                </button>
              </div>
            </div>

            {/* Icon buttons */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '14px' }}>Icon Buttons</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { icon: <ShoppingBag size={18} />, bg: '#2C2520', color: '#FFF', label: 'Cart' },
                  { icon: <Heart size={18} />, bg: '#FAF8F4', color: '#8B7D72', label: 'Wishlist', border: '#E0D8CC' },
                  { icon: <Search size={18} />, bg: '#F5F0E8', color: '#5C5247', label: 'Search' },
                  { icon: <Bell size={18} />, bg: '#C9A96E', color: '#FFF', label: 'Alert' },
                  { icon: <X size={18} />, bg: 'transparent', color: '#8B7D72', label: 'Close', border: '#E0D8CC' },
                  { icon: <Check size={18} />, bg: '#2C2520', color: '#C9A96E', label: 'Done' },
                ].map(b => (
                  <div key={b.label} style={{ textAlign: 'center' }}>
                    <button style={{
                      width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: b.bg, color: b.color, border: b.border ? `1.5px solid ${b.border}` : 'none', cursor: 'pointer',
                    }}>
                      {b.icon}
                    </button>
                    <div style={{ fontSize: '9px', color: '#8B7D72', marginTop: '4px' }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 COMPONENTS ────────────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="04" title="Components" subtitle="Komponen siap pakai yang diambil langsung dari UI produksi" />

          {/* Product Card */}
          <div className="mb-6">
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Product Card</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Sauvage EDP', brand: 'Dior', category: 'DECANT', price: 'Rp 45.000', badge: null, img: '#3C3327' },
                { name: 'Libre EDP', brand: 'Yves Saint Laurent', category: 'PRELOVED', price: 'Rp 850.000', badge: 'HOT', img: '#8B5EAB' },
                { name: 'Bleu de Chanel', brand: 'Chanel', category: 'BNIB', price: 'Rp 1.850.000', badge: 'NEW', img: '#2C2520' },
                { name: 'Black Opium', brand: 'YSL', category: 'DECANT', price: 'Rp 55.000', badge: null, img: '#4AACBF' },
              ].map(p => (
                <div key={p.name} style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E0D8CC' }}>
                  <div style={{ height: '120px', background: p.img, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '64px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} />
                    {p.badge && (
                      <div style={{ position: 'absolute', top: '8px', left: '8px', padding: '2px 8px', background: '#C9A96E', color: '#FFF', borderRadius: '9999px', fontSize: '9px', letterSpacing: '0.1em' }}>{p.badge}</div>
                    )}
                    <button style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={12} style={{ color: '#8B7D72' }} />
                    </button>
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <span style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E' }}>{p.category}</span>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', color: '#2C2520', lineHeight: 1.3, margin: '2px 0' }}>{p.name}</div>
                    <div style={{ fontSize: '10px', color: '#8B7D72', marginBottom: '8px' }}>{p.brand}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#2C2520' }}>{p.price}</span>
                      <button style={{ width: '26px', height: '26px', background: '#2C2520', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={11} style={{ color: '#FFF' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navbar */}
          <div className="mb-6">
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Navbar</p>
            <div style={{ background: '#2C2520', borderRadius: '12px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C9A96E' }} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#FFFFFF', letterSpacing: '0.05em' }}>your.i scent</span>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {['Katalog', 'Decant', 'Preloved', 'BNIB'].map(n => (
                  <span key={n} style={{ fontSize: '12px', color: n === 'Katalog' ? '#C9A96E' : '#8B7D72', cursor: 'pointer' }}>{n}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Search size={16} style={{ color: '#8B7D72', cursor: 'pointer' }} />
                <div style={{ position: 'relative' }}>
                  <ShoppingBag size={18} style={{ color: '#FFFFFF', cursor: 'pointer' }} />
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '14px', height: '14px', background: '#C9A96E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#FFF' }}>2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar + Input Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Search Bar</p>
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #E0D8CC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#F5F0E8', borderRadius: '9999px', border: '1px solid #E0D8CC' }}>
                  <Search size={15} style={{ color: '#8B7D72', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#B0A49A' }}>Cari parfum...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#FFFFFF', borderRadius: '9999px', border: '1.5px solid #C9A96E', marginTop: '8px' }}>
                  <Search size={15} style={{ color: '#C9A96E', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#2C2520' }}>Dior Sauvage</span>
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Input Fields</p>
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #E0D8CC', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input readOnly placeholder="Default — border #E0D8CC" style={{ padding: '9px 12px', border: '1px solid #E0D8CC', borderRadius: '8px', fontSize: '12px', background: '#FAF8F4', color: '#8B7D72', outline: 'none' }} />
                <input readOnly defaultValue="Focus — border #C9A96E" style={{ padding: '9px 12px', border: '1.5px solid #C9A96E', borderRadius: '8px', fontSize: '12px', background: '#FAF8F4', color: '#2C2520', outline: 'none' }} />
                <input readOnly placeholder="Error — border red-400" style={{ padding: '9px 12px', border: '1.5px solid #F87171', borderRadius: '8px', fontSize: '12px', background: '#FEF2F2', color: '#8B7D72', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Badges + Tags */}
          <div className="mb-6">
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Badges & Tags</p>
            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E0D8CC', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { text: 'DECANT', bg: '#EDE8DC', color: '#5C5247' },
                { text: 'PRELOVED', bg: 'rgba(60,51,39,0.1)', color: '#3C3327' },
                { text: 'BNIB', bg: 'rgba(201,169,110,0.15)', color: '#8B6914' },
                { text: 'NEW', bg: '#C9A96E', color: '#FFFFFF' },
                { text: 'HOT', bg: '#2C2520', color: '#C9A96E' },
                { text: 'SOLD OUT', bg: '#F5F0E8', color: '#B0A49A' },
                { text: 'Fresh', bg: '#EAF6F9', color: '#1E6878', border: '#4AACBF' },
                { text: 'Floral', bg: '#FBF0F4', color: '#8B3A55', border: '#D4819A' },
                { text: 'Woody', bg: '#F5EDE0', color: '#5C3820', border: '#A07040' },
                { text: 'Oriental', bg: '#F0EBF8', color: '#4A2870', border: '#8B5EAB' },
              ].map(b => (
                <span key={b.text} style={{ padding: '4px 10px', background: b.bg, color: b.color, borderRadius: '9999px', fontSize: '10px', letterSpacing: '0.08em', border: b.border ? `1px solid ${b.border}` : 'none', fontWeight: 500 }}>
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Rating + Stars */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Rating, Divider & Misc</p>
            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E0D8CC', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= 4 ? '#C9A96E' : 'none'} style={{ color: '#C9A96E' }} />)}
              </div>
              <div style={{ height: '20px', width: '1px', background: '#E0D8CC' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '1px', background: '#C9A96E' }} />
                <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A96E' }}>section label</span>
                <div style={{ width: '32px', height: '1px', background: '#C9A96E' }} />
              </div>
              <div style={{ height: '20px', width: '1px', background: '#E0D8CC' }} />
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ height: '6px', width: '20px', background: i <= 3 ? '#C9A96E' : '#E0D8CC', borderRadius: '3px' }} />
                ))}
                <span style={{ fontSize: '10px', color: '#8B7D72', marginLeft: '4px' }}>Intensity bar</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 SPACING ───────────────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="05" title="Spacing System" subtitle="Skala 8px base — semua spacing adalah kelipatan 4px" />
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', overflow: 'hidden' }}>
            {SPACING.map((s, i) => (
              <div key={s.token} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 20px', borderTop: i === 0 ? 'none' : '1px solid #F0EBE1' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#C9A96E', width: '32px' }}>{s.token}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8B7D72', width: '40px' }}>{s.px}px</span>
                <div style={{ height: '20px', background: '#C9A96E', borderRadius: '3px', width: s.px, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#5C5247' }}>{s.use}</span>
              </div>
            ))}
          </div>

          {/* Border radius */}
          <div className="mt-6">
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D72', marginBottom: '12px' }}>Border Radius</p>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {RADIUS.map(r => (
                <div key={r.token} style={{ textAlign: 'center' }}>
                  <div style={{ width: r.token === 'full' ? '48px' : '48px', height: r.token === 'full' ? '48px' : '48px', background: '#F5F0E8', border: '2px solid #C9A96E', borderRadius: r.value, marginBottom: '8px' }} />
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#C9A96E' }}>{r.token}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#8B7D72' }}>{r.value}</div>
                  <div style={{ fontSize: '9px', color: '#B0A49A', maxWidth: '60px' }}>{r.use}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 ICON STYLE ────────────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="06" title="Icon System" subtitle="Lucide React — outline style, stroke-width 1.5, size 16–24px" />
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0D8CC', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
              {[
                [<ShoppingBag size={22} />, 'ShoppingBag'],
                [<Heart size={22} />, 'Heart'],
                [<Search size={22} />, 'Search'],
                [<Star size={22} />, 'Star'],
                [<ArrowRight size={22} />, 'ArrowRight'],
                [<X size={22} />, 'X'],
                [<Check size={22} />, 'Check'],
                [<ChevronDown size={22} />, 'ChevronDown'],
                [<Bell size={22} />, 'Bell'],
                [<User size={22} />, 'User'],
                [<Menu size={22} />, 'Menu'],
              ].map(([icon, name]) => (
                <div key={name as string} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#2C2520', marginBottom: '6px' }}>{icon as React.ReactNode}</div>
                  <div style={{ fontSize: '9px', color: '#8B7D72', fontFamily: 'monospace' }}>{name as string}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', background: '#F5F0E8', borderRadius: '10px', fontSize: '12px', color: '#5C5247', lineHeight: 1.6 }}>
              <strong>Library:</strong> lucide-react &nbsp;·&nbsp;
              <strong>Style:</strong> Outline (stroke, tidak filled) &nbsp;·&nbsp;
              <strong>Stroke-width:</strong> 1.5px &nbsp;·&nbsp;
              <strong>Sizes:</strong> 14px (caption) · 16px (nav) · 18–20px (CTA) · 22–24px (hero)
            </div>
          </div>
        </section>

        {/* ── 07 DESIGN PRINCIPLES ─────────────────────────────────────────── */}
        <section className="print:break-before-page mb-16">
          <SectionTitle number="07" title="Design Principles" subtitle="Filosofi visual yang menjadi landasan semua keputusan desain" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { title: 'Premium Minimalism', desc: 'Whitespace adalah elemen desain. Tidak ada clutter. Setiap elemen harus earn its place di layout.' },
              { title: 'Unisex Palette', desc: 'Tidak merah muda, tidak biru terang. Cream, charcoal, dan gold adalah warna yang nyaman dipakai semua gender.' },
              { title: 'Serif + Sans Harmony', desc: 'Cormorant Garamond memberi kesan luxury & artisanal. Inter memberikan keterbacaan modern & clean.' },
              { title: 'Tactile Feedback', desc: 'Setiap interaksi punya transisi (200ms ease). Hover scale, color shift, shadow lift — terasa seperti menyentuh kemasan parfum fisik.' },
              { title: 'Hierarchy via Size', desc: 'Bukan tebal/bold yang membangun hierarki, melainkan ukuran & kontras warna. Heading ringan (weight 300–400) tapi besar.' },
              { title: 'Purposeful Color', desc: 'Warna tidak dekoratif. Gold = action/CTA. Cream = rest/background. Dark brown = authority/trust. Warna scent = informasi.' },
            ].map(p => (
              <div key={p.title} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '18px', border: '1px solid #E0D8CC' }}>
                <div style={{ width: '24px', height: '2px', background: '#C9A96E', borderRadius: '2px', marginBottom: '10px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C2520', marginBottom: '6px' }}>{p.title}</div>
                <div style={{ fontSize: '11px', color: '#8B7D72', lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 08 QUICK REFERENCE ───────────────────────────────────────────── */}
        <section className="mb-16">
          <SectionTitle number="08" title="Quick Token Reference" subtitle="Copy-paste siap pakai untuk Figma Styles / CSS Variables" />
          <div style={{ background: '#2C2520', borderRadius: '16px', padding: '24px', fontFamily: 'monospace', fontSize: '11px', lineHeight: 2, color: '#8B7D72' }}>
            <div style={{ color: '#C9A96E', marginBottom: '4px' }}>/* ── Colors ── */</div>
            {[
              ['--color-bg',       '#FAF8F4',  '/* Page background */'],
              ['--color-surface',  '#FFFFFF',  '/* Card / modal */'],
              ['--color-surface-subtle', '#F5F0E8', '/* Section bg */'],
              ['--color-border',   '#E0D8CC',  '/* Divider */'],
              ['--color-primary',  '#2C2520',  '/* Main dark */'],
              ['--color-body',     '#5C5247',  '/* Body text */'],
              ['--color-muted',    '#8B7D72',  '/* Muted text */'],
              ['--color-gold',     '#C9A96E',  '/* CTA / accent */'],
              ['--color-gold-dark','#B8966A',  '/* Gold hover */'],
            ].map(([k, v, c]) => (
              <div key={k as string}><span style={{ color: '#E0D8CC' }}>{k as string}</span>: <span style={{ color: '#C9A96E' }}>{v as string}</span> <span>{c as string}</span></div>
            ))}
            <div style={{ color: '#C9A96E', marginTop: '12px', marginBottom: '4px' }}>/* ── Typography ── */</div>
            {[
              ['--font-display', '"Cormorant Garamond", serif'],
              ['--font-body',    '"Inter", sans-serif'],
              ['--text-display', '48–80px / weight 300'],
              ['--text-h1',      '36–48px / weight 400'],
              ['--text-h2',      '28–36px / weight 400'],
              ['--text-body',    '14px / weight 400'],
              ['--text-label',   '10–12px / weight 500 / uppercase / tracking 0.15em'],
            ].map(([k, v]) => (
              <div key={k as string}><span style={{ color: '#E0D8CC' }}>{k as string}</span>: <span style={{ color: '#C9A96E' }}>{v as string}</span></div>
            ))}
          </div>
        </section>

        {/* ── EXPORT GUIDE ─────────────────────────────────────────────────── */}
        <section style={{ background: '#F5F0E8', borderRadius: '20px', padding: '28px', border: '1px solid #E0D8CC' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A96E' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A96E' }}>Cara Export ke Figma</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Print to PDF',
                desc: 'Tekan Ctrl+P (Win) atau ⌘+P (Mac) di halaman ini → Save as PDF. Pilih "Background graphics" agar warna tampil.',
              },
              {
                step: '02',
                title: 'Import ke Figma',
                desc: 'Drag & drop PDF ke canvas Figma. Atau gunakan plugin "PDF Import" / "Merge PDFs". Setiap halaman jadi frame terpisah.',
              },
              {
                step: '03',
                title: 'Recreate Styles',
                desc: 'Pakai token di section 08 untuk buat Color & Text Styles di Figma. Add dari panel Design → Local Styles → +',
              },
            ].map(s => (
              <div key={s.step} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #E0D8CC' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 300, color: '#C9A96E', lineHeight: 1 }}>{s.step}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C2520', margin: '6px 0 4px' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: '#8B7D72', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#2C2520', borderRadius: '10px', fontSize: '11px', color: '#8B7D72', lineHeight: 1.6 }}>
            <span style={{ color: '#C9A96E' }}>💡 Tips Prototype di Figma:</span> Untuk wireframe interaktif, buat frame tiap halaman (Home, Catalog, ProductPage, Cart, Quiz) → hubungkan dengan Prototype connections di panel kanan → Preview dengan ⌘+P. Gunakan komponen (Components) dari design system ini sebagai atom/molecule untuk disusun jadi halaman.
          </div>
        </section>

        {/* Footer */}
        <div style={{ marginTop: '48px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #E0D8CC' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#2C2520', marginBottom: '4px' }}>your.i scent</div>
          <div style={{ fontSize: '11px', color: '#B0A49A' }}>UI Design System v1.0 · April 2026 · Strictly for internal & academic use</div>
        </div>
      </div>

      {/* Print-only watermark */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:break-before-page { break-before: page; }
          .print\\:break-after-page  { break-after:  page; }
        }
      `}</style>
    </div>
  );
}
