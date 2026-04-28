import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, CheckCircle, Clock, Search, MessageCircle,
  FileText, Printer, X, Send, Plus, Pencil, Trash2, Package, AlertCircle, Truck,
} from 'lucide-react';
import { MOCK_ORDERS as INITIAL, Order, OrderItem, OrderCategory, generateOrderId } from '../../data/orders';
import { useProducts } from '../../context/ProductsContext';

const WA_NUMBER = '6281234567890';
const STORE_NAME = 'your.i scent';
const STORE_WA   = '0812-3456-7890';
const STORE_IG   = '@your.i.scent';

const CATEGORY_LABELS: Record<OrderCategory, string> = {
  bnib: 'BNIB', preloved: 'Preloved', decant: 'Decant',
};
const CATEGORY_COLORS: Record<OrderCategory, string> = {
  bnib:     'bg-amber-50 text-amber-700 border-amber-200',
  preloved: 'bg-purple-50 text-purple-700 border-purple-200',
  decant:   'bg-teal-50 text-teal-700 border-teal-200',
};
const ID_COLORS: Record<string, string> = {
  B: 'text-amber-600', P: 'text-purple-600', D: 'text-teal-600', M: 'text-gray-500',
};

function idColor(id: string) {
  const part = id.split('-')[1] ?? '';
  if (part.startsWith('B')) return ID_COLORS.B;
  if (part.startsWith('P')) return ID_COLORS.P;
  if (part.startsWith('D')) return ID_COLORS.D;
  return ID_COLORS.M;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function invoiceNumber(id: string) { return 'INV-' + id.toUpperCase(); }

// ─── WA: notifikasi ongkir ────────────────────────────────────────────────────
function buildWaShipping(order: Order): string {
  return `Halo kak *${order.customerName}* 👋\n\nBerikut update untuk pesanan *${order.id}*:\n\n🚚 *Ongkos kirim ke alamatmu:*\n*${rp(order.shipping)}*\n\n📊 Rincian:\n- Subtotal   : ${rp(order.subtotal)}\n- Ongkir     : ${rp(order.shipping)}\n- *TOTAL : ${rp(order.total)}*\n\nSilakan lakukan pembayaran sesuai metode yang dipilih ya kak. Setelah transfer, harap konfirmasi ke sini dengan bukti bayar 🙏\n\nTerima kasih! 🌸\n_${STORE_NAME} | WA ${STORE_WA} | IG ${STORE_IG}_`;
}

// ─── WA: ringkasan invoice ────────────────────────────────────────────────────
function buildWaInvoice(order: Order): string {
  const lines = order.items.map(i =>
    `  • ${i.name}${i.size ? ` [${i.size}]` : ''} (${i.brand}) ×${i.qty} = ${rp(i.price * i.qty)}`
  ).join('\n');
  return `🧾 *INVOICE ${invoiceNumber(order.id)}*\n_${STORE_NAME}_\n──────────────────\n\n👤 *Pelanggan:* ${order.customerName}\n📱 *No. HP:* ${order.phone}\n🏠 *Alamat:* ${order.address}\n\n📦 *Pesanan:*\n${lines}\n\n──────────────────\n💰 Subtotal : ${rp(order.subtotal)}\n🚚 Ongkir   : ${order.shippingStatus === 'tbd' ? 'Dikonfirmasi' : rp(order.shipping)}\n✅ *TOTAL   : ${rp(order.total)}*\n──────────────────\n💳 *Pembayaran:* ${order.payment || '-'}\n${order.note ? `📝 *Catatan:* ${order.note}` : ''}\n📅 *Tanggal:* ${formatDate(order.createdAt)}\n\nTerima kasih sudah berbelanja! 🌸\n_${STORE_NAME} | WA ${STORE_WA} | IG ${STORE_IG}_`;
}

// ─── Print Invoice ────────────────────────────────────────────────────────────
function printInvoice(order: Order) {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #F0EBE1;">
        <div style="font-size:13px;color:#2C2520;">${item.name}${item.size ? ` <span style="font-size:11px;color:#C9A96E;">[${item.size}]</span>` : ''}</div>
        <div style="font-size:11px;color:#8B7D72;">${item.brand} · <span style="font-size:10px;padding:1px 5px;border-radius:3px;background:${item.category === 'bnib' ? '#FEF3C7' : item.category === 'preloved' ? '#F3E8FF' : '#CCFBF1'};color:${item.category === 'bnib' ? '#92400E' : item.category === 'preloved' ? '#6B21A8' : '#0F766E'};">${CATEGORY_LABELS[item.category]}</span></div>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #F0EBE1;text-align:center;font-size:13px;color:#5C5247;">×${item.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #F0EBE1;text-align:right;font-size:13px;color:#2C2520;">${rp(item.price * item.qty)}</td>
    </tr>`).join('');

  const shippingRow = order.shippingStatus === 'tbd'
    ? `<div class="totals-row"><span>Ongkos Kirim</span><span style="color:#D97706;font-style:italic;">Dikonfirmasi</span></div>`
    : `<div class="totals-row"><span>Ongkos Kirim</span><span>${rp(order.shipping)}</span></div>`;

  const html = `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"/>
<title>Invoice ${invoiceNumber(order.id)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Georgia',serif;background:#fff;color:#2C2520;padding:40px;max-width:560px;margin:0 auto;}
.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #2C2520;margin-bottom:24px;}
.brand{font-size:26px;letter-spacing:.12em;font-style:italic;}
.brand span{color:#C9A96E;}
.invoice-label{text-align:right;}
.invoice-label .title{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#8B7D72;font-family:Arial,sans-serif;}
.invoice-label .number{font-size:18px;margin-top:2px;}
.invoice-label .date{font-size:11px;color:#8B7D72;margin-top:4px;font-family:Arial,sans-serif;}
.info-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;}
.info-box h4{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#C9A96E;margin-bottom:6px;font-family:Arial,sans-serif;}
.info-box p{font-size:13px;color:#2C2520;line-height:1.6;}
.info-box p.gray{color:#5C5247;font-size:12px;}
.items-title{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#C9A96E;margin-bottom:10px;font-family:Arial,sans-serif;}
table{width:100%;border-collapse:collapse;margin-bottom:0;}
thead tr{border-bottom:1px solid #2C2520;}
thead th{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#8B7D72;font-family:Arial,sans-serif;font-weight:normal;padding-bottom:8px;}
thead th:first-child{text-align:left;}
thead th:nth-child(2){text-align:center;}
thead th:last-child{text-align:right;}
.totals{margin-top:16px;border-top:1px solid #E0D8CC;padding-top:12px;}
.totals-row{display:flex;justify-content:space-between;font-size:13px;color:#5C5247;margin-bottom:6px;font-family:Arial,sans-serif;}
.totals-row.grand{font-size:15px;color:#2C2520;font-weight:bold;border-top:1px solid #2C2520;padding-top:10px;margin-top:6px;}
.meta{margin-top:20px;padding:12px 16px;background:#FAF8F4;border-radius:8px;font-family:Arial,sans-serif;}
.meta-row{display:flex;gap:8px;font-size:12px;color:#5C5247;margin-bottom:4px;}
.meta-row span:first-child{color:#8B7D72;min-width:90px;}
.status{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-family:Arial,sans-serif;}
.status.selesai{background:#D1FAE5;color:#065F46;}
.status.pending{background:#FEF3C7;color:#92400E;}
.footer{margin-top:32px;padding-top:20px;border-top:1px solid #E0D8CC;text-align:center;}
.footer .thanks{font-size:18px;font-style:italic;margin-bottom:6px;}
.footer .thanks span{color:#C9A96E;}
.footer .contact{font-size:11px;color:#8B7D72;font-family:Arial,sans-serif;}
@media print{body{padding:24px;}@page{margin:16mm;}}
</style></head><body>
<div class="header">
  <div class="brand">your<span>.</span>i scent</div>
  <div class="invoice-label">
    <div class="title">Invoice</div>
    <div class="number">${invoiceNumber(order.id)}</div>
    <div class="date">${formatDate(order.createdAt)}</div>
  </div>
</div>
<div class="info-row">
  <div class="info-box">
    <h4>Kepada</h4>
    <p>${order.customerName}</p>
    <p class="gray">${order.phone}</p>
    <p class="gray" style="margin-top:4px;">${order.address}</p>
  </div>
  <div class="info-box" style="text-align:right;">
    <h4>Status</h4>
    <span class="status ${order.status}">${order.status === 'selesai' ? 'Selesai' : 'Pending'}</span>
    ${order.payment ? `<p class="gray" style="margin-top:8px;">Bayar via ${order.payment}</p>` : ''}
  </div>
</div>
<div class="items-title">Rincian Pesanan</div>
<table>
  <thead><tr><th>Produk</th><th>Qty</th><th>Harga</th></tr></thead>
  <tbody>${itemRows}</tbody>
</table>
<div class="totals">
  <div class="totals-row"><span>Subtotal</span><span>${rp(order.subtotal)}</span></div>
  ${shippingRow}
  <div class="totals-row grand"><span>TOTAL</span><span>${rp(order.total)}</span></div>
</div>
${(order.payment || order.note) ? `
<div class="meta">
  ${order.payment ? `<div class="meta-row"><span>Pembayaran</span><span>${order.payment}</span></div>` : ''}
  ${order.note    ? `<div class="meta-row"><span>Catatan</span><span>${order.note}</span></div>` : ''}
</div>` : ''}
<div class="footer">
  <div class="thanks">Terima kasih sudah berbelanja di <span>your.i scent</span> ✨</div>
  <div class="contact">WA ${STORE_WA} &nbsp;·&nbsp; IG ${STORE_IG}</div>
</div>
<script>window.onload=()=>window.print();</script>
</body></html>`;

  const win = window.open('', '_blank', 'width=700,height=900');
  if (!win) { alert('Izinkan pop-up untuk mencetak invoice.'); return; }
  win.document.write(html);
  win.document.close();
}

// ─── Tipe draft item ──────────────────────────────────────────────────────────
interface DraftItem {
  name: string; brand: string;
  category: OrderCategory; size: string;
  price: string; qty: string;
}

const emptyDraft: DraftItem = {
  name: '', brand: '', category: 'decant', size: '5ml', price: '', qty: '1',
};

const paymentOptions = ['Transfer BCA', 'Transfer Mandiri', 'GoPay / OVO', 'QRIS', 'COD'];

// ─── Komponen utama ───────────────────────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders]     = useState<Order[]>(INITIAL);
  const { reduceStock } = useProducts();
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<'all' | 'pending' | 'selesai'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Edit ongkir
  const [editingShipping, setEditingShipping] = useState<string | null>(null);
  const [shippingInput, setShippingInput]     = useState('');

  // Invoice modal
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Tambah pesanan modal
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState({ name: '', phone: '', address: '', note: '', payment: 'Transfer BCA' });
  const [draftItems, setDraftItems] = useState<(DraftItem & { id: number })[]>([]);
  const [newItem, setNewItem]       = useState<DraftItem>(emptyDraft);
  const [draftItemId, setDraftItemId] = useState(0);

  // ── Filter ──
  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.customerName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  // ── Status — otomatis kurangi stok saat Selesai ──
  const updateStatus = (id: string, status: 'pending' | 'selesai') => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      // Kurangi stok hanya saat pertama kali di-mark selesai
      if (status === 'selesai' && o.status !== 'selesai') {
        o.items.forEach(item => {
          reduceStock(item.productId, item.qty, item.size);
        });
      }
      return { ...o, status };
    }));
  };

  // ── Edit ongkir ──
  const startEditShipping = (o: Order) => {
    setEditingShipping(o.id);
    setShippingInput(o.shipping > 0 ? String(o.shipping) : '');
  };

  const saveShipping = (order: Order) => {
    const val = parseInt(shippingInput.replace(/\D/g, ''), 10) || 0;
    setOrders(prev => prev.map(o => o.id === order.id
      ? { ...o, shipping: val, total: o.subtotal + val, shippingStatus: 'confirmed' }
      : o));
    setEditingShipping(null);
  };

  // ── Tambah item ke draft ──
  const addDraftItem = () => {
    if (!newItem.name || !newItem.price) return;
    setDraftItems(prev => [...prev, { ...newItem, id: draftItemId }]);
    setDraftItemId(n => n + 1);
    setNewItem(emptyDraft);
  };

  // ── Submit tambah pesanan ──
  const submitAddOrder = () => {
    if (!addForm.name || !addForm.phone || draftItems.length === 0) return;
    const items: OrderItem[] = draftItems.map(d => ({
      productId: `manual-${d.id}`,
      name: d.name, brand: d.brand,
      category: d.category,
      size: d.category === 'decant' ? d.size : undefined,
      price: parseInt(d.price.replace(/\D/g, ''), 10) || 0,
      qty: parseInt(d.qty, 10) || 1,
    }));
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const id = generateOrderId(items);
    const newOrder: Order = {
      id, customerName: addForm.name, phone: addForm.phone,
      address: addForm.address, note: addForm.note,
      items, subtotal, shipping: 0, shippingStatus: 'tbd',
      total: subtotal, payment: addForm.payment,
      status: 'pending', createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setShowAdd(false);
    setAddForm({ name: '', phone: '', address: '', note: '', payment: 'Transfer BCA' });
    setDraftItems([]);
    setNewItem(emptyDraft);
    setExpanded(newOrder.id);
  };

  // ── Style helpers ──
  const inp = 'w-full px-3 py-2 border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors bg-[#FAF8F4]';
  const lbl = 'text-xs text-[#8B7D72] uppercase tracking-wide mb-1 block';

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem' }}>Kelola Pesanan</h1>
          <p className="text-sm text-[#8B7D72] mt-0.5">{orders.length} pesanan total</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
            {orders.filter(o => o.status === 'pending').length} Pending
          </span>
          <span className="text-xs px-2.5 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
            {orders.filter(o => o.status === 'selesai').length} Selesai
          </span>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2C2520] text-white rounded-lg text-xs hover:bg-[#C9A96E] transition-colors"
          >
            <Plus size={13} /> Tambah Pesanan
          </button>
        </div>
      </div>

      {/* ── ID Format Legend ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { code: 'ORD-B-*',   label: 'BNIB',    cls: 'bg-amber-50 text-amber-700 border-amber-200' },
          { code: 'ORD-P-*',   label: 'Preloved', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
          { code: 'ORD-D5-*',  label: 'Decant 5ml', cls: 'bg-teal-50 text-teal-700 border-teal-200' },
          { code: 'ORD-D2-*',  label: 'Decant 2ml', cls: 'bg-teal-50 text-teal-700 border-teal-200' },
          { code: 'ORD-D10-*', label: 'Decant 10ml', cls: 'bg-teal-50 text-teal-700 border-teal-200' },
          { code: 'ORD-M-*',   label: 'Mixed',    cls: 'bg-gray-50 text-gray-600 border-gray-200' },
        ].map(b => (
          <span key={b.code} className={`text-[10px] px-2 py-0.5 rounded border font-mono ${b.cls}`}>
            {b.code} <span className="opacity-60">= {b.label}</span>
          </span>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7D72]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama pelanggan atau ID pesanan..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E0D8CC] rounded-lg text-sm text-[#2C2520] placeholder-[#8B7D72] outline-none focus:border-[#C9A96E] transition-colors" />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'selesai'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs transition-colors ${filter === s
                ? 'bg-[#2C2520] text-white'
                : 'bg-white border border-[#E0D8CC] text-[#5C5247] hover:border-[#C9A96E]'}`}>
              {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders list ── */}
      <div className="space-y-3">
        {filtered.map(order => {
          const isEdShip = editingShipping === order.id;
          const updatedOrder = orders.find(o => o.id === order.id) ?? order;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden">

              {/* Summary row */}
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#FAF8F4] transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${updatedOrder.status === 'selesai' ? 'bg-green-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <div className="text-xs text-[#8B7D72]">Pelanggan</div>
                    <div className="text-sm text-[#2C2520] truncate">{updatedOrder.customerName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#8B7D72]">ID Pesanan</div>
                    <div className={`text-xs font-mono ${idColor(updatedOrder.id)}`}>{updatedOrder.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#8B7D72]">Total</div>
                    <div className="text-sm text-[#2C2520]">{rp(updatedOrder.total)}</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-[#8B7D72]">Ongkir</div>
                    <div className="text-xs">
                      {updatedOrder.shippingStatus === 'tbd'
                        ? <span className="text-amber-500 flex items-center gap-1"><AlertCircle size={11} /> TBD</span>
                        : <span className="text-green-600">{rp(updatedOrder.shipping)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${updatedOrder.status === 'selesai'
                    ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {updatedOrder.status}
                  </span>
                  {expanded === order.id
                    ? <ChevronUp size={16} className="text-[#8B7D72]" />
                    : <ChevronDown size={16} className="text-[#8B7D72]" />}
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === order.id && (
                <div className="border-t border-[#F0EBE1] p-5 space-y-5">

                  {/* Info pelanggan + items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs text-[#8B7D72] uppercase tracking-wide mb-3">Info Pelanggan</h4>
                      <div className="space-y-1.5 text-sm text-[#5C5247]">
                        <div><span className="text-[#8B7D72]">Nama: </span>{updatedOrder.customerName}</div>
                        <div><span className="text-[#8B7D72]">HP: </span>
                          <a href={`tel:${updatedOrder.phone}`} className="text-[#C9A96E] hover:underline">{updatedOrder.phone}</a>
                        </div>
                        <div><span className="text-[#8B7D72]">Alamat: </span>{updatedOrder.address}</div>
                        {updatedOrder.payment && <div><span className="text-[#8B7D72]">Pembayaran: </span>{updatedOrder.payment}</div>}
                        {updatedOrder.note && <div><span className="text-[#8B7D72]">Catatan: </span>{updatedOrder.note}</div>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-[#8B7D72] uppercase tracking-wide mb-3">Item Pesanan</h4>
                      <div className="space-y-2">
                        {updatedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-2 text-sm">
                            <div>
                              <span className="text-[#2C2520]">{item.name}</span>
                              {item.size && <span className="ml-1 text-[10px] text-[#C9A96E]">[{item.size}]</span>}
                              <span className="text-[#8B7D72]"> ×{item.qty}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[item.category]}`}>
                                  {CATEGORY_LABELS[item.category]}
                                </span>
                                <span className="text-[11px] text-[#8B7D72]">{item.brand}</span>
                              </div>
                            </div>
                            <span className="text-[#2C2520] whitespace-nowrap">{rp(item.price * item.qty)}</span>
                          </div>
                        ))}
                        <div className="border-t border-[#F0EBE1] pt-2 text-sm text-[#8B7D72]">
                          Subtotal: <span className="text-[#2C2520]">{rp(updatedOrder.subtotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── ONGKIR SECTION ── */}
                  <div className={`rounded-xl p-4 border ${updatedOrder.shippingStatus === 'tbd'
                    ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck size={15} className={updatedOrder.shippingStatus === 'tbd' ? 'text-amber-500' : 'text-green-600'} />
                        <span className="text-sm text-[#2C2520]">Ongkos Kirim</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${updatedOrder.shippingStatus === 'tbd'
                          ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-700'}`}>
                          {updatedOrder.shippingStatus === 'tbd' ? 'Belum dikonfirmasi' : 'Sudah dikonfirmasi'}
                        </span>
                      </div>
                      {!isEdShip && (
                        <button onClick={() => startEditShipping(updatedOrder)}
                          className="flex items-center gap-1 text-xs text-[#8B7D72] hover:text-[#2C2520] transition-colors">
                          <Pencil size={12} /> Edit
                        </button>
                      )}
                    </div>

                    {isEdShip ? (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8B7D72]">Rp</span>
                          <input
                            type="text"
                            value={shippingInput}
                            onChange={e => setShippingInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="Masukkan nominal ongkir"
                            className="w-full pl-9 pr-3 py-2 border border-[#C9A96E] rounded-lg text-sm bg-white outline-none text-[#2C2520]"
                            autoFocus
                          />
                        </div>
                        <button onClick={() => saveShipping(updatedOrder)}
                          className="px-3 py-2 bg-[#2C2520] text-white rounded-lg text-xs hover:bg-[#C9A96E] transition-colors">
                          Simpan
                        </button>
                        <button onClick={() => setEditingShipping(null)}
                          className="px-3 py-2 bg-[#F5F0E8] text-[#5C5247] rounded-lg text-xs">
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <div className={`text-lg ${updatedOrder.shippingStatus === 'tbd' ? 'text-amber-500 italic text-sm' : 'text-green-700'}`}>
                            {updatedOrder.shippingStatus === 'tbd' ? 'Menunggu konfirmasi ongkir' : rp(updatedOrder.shipping)}
                          </div>
                          <div className="text-xs text-[#8B7D72] mt-0.5">
                            Total akhir: <span className="text-[#2C2520]">{rp(updatedOrder.total)}</span>
                          </div>
                        </div>
                        {updatedOrder.shippingStatus === 'confirmed' && (
                          <a href={`https://wa.me/${updatedOrder.phone.replace(/\D/g, '')}?text=${encodeURIComponent(buildWaShipping(updatedOrder))}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#22c35e] transition-colors">
                            <MessageCircle size={12} /> Beritahu via WA
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Actions ── */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0EBE1]">
                    {updatedOrder.status === 'pending' && (
                      <button onClick={() => updateStatus(order.id, 'selesai')}
                        className="flex items-center gap-1.5 text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <CheckCircle size={13} /> Tandai Selesai
                      </button>
                    )}
                    {updatedOrder.status === 'selesai' && (
                      <button onClick={() => updateStatus(order.id, 'pending')}
                        className="flex items-center gap-1.5 text-xs px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                        <Clock size={13} /> Kembalikan ke Pending
                      </button>
                    )}
                    <button onClick={() => setInvoiceOrder(updatedOrder)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#2C2520] text-white rounded-lg hover:bg-[#C9A96E] transition-colors">
                      <FileText size={13} /> Lihat Invoice
                    </button>
                    <button onClick={() => printInvoice(updatedOrder)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#F5F0E8] text-[#5C5247] rounded-lg hover:bg-[#C9A96E]/10 transition-colors">
                      <Printer size={13} /> Cetak PDF
                    </button>
                    <a href={`https://wa.me/${updatedOrder.phone.replace(/\D/g, '')}?text=${encodeURIComponent(buildWaInvoice(updatedOrder))}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#25D366]/10 text-[#128C7E] rounded-lg hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle size={13} /> Kirim Invoice via WA
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E0D8CC]">
            <Package size={32} className="mx-auto text-[#E0D8CC] mb-3" />
            <p className="text-sm text-[#8B7D72]">Tidak ada pesanan ditemukan</p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* INVOICE PREVIEW MODAL */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {invoiceOrder && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#2C2520]">
              <div>
                <div className="text-[#C9A96E] text-xs tracking-widest uppercase">Invoice</div>
                <div className="text-white text-sm font-mono mt-0.5">{invoiceNumber(invoiceOrder.id)}</div>
              </div>
              <button onClick={() => setInvoiceOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6" style={{ fontFamily: "'Georgia', serif" }}>
              {/* Store */}
              <div className="flex items-start justify-between mb-6 pb-5 border-b border-[#E0D8CC]">
                <div>
                  <div className="text-[#2C2520]" style={{ fontSize: '1.3rem', fontStyle: 'italic', letterSpacing: '0.08em' }}>
                    your<span style={{ color: '#C9A96E' }}>.</span>i scent
                  </div>
                  <div className="text-xs text-[#8B7D72] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    WA {STORE_WA} · IG {STORE_IG}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${invoiceOrder.status === 'selesai' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {invoiceOrder.status === 'selesai' ? 'Selesai' : 'Pending'}
                  </span>
                  <div className="text-xs text-[#8B7D72] mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formatDate(invoiceOrder.createdAt)}
                  </div>
                </div>
              </div>
              {/* Kepada */}
              <div className="mb-5">
                <div className="text-[10px] tracking-widest uppercase text-[#C9A96E] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Kepada</div>
                <div className="text-sm text-[#2C2520]">{invoiceOrder.customerName}</div>
                <div className="text-xs text-[#8B7D72] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{invoiceOrder.phone}</div>
                <div className="text-xs text-[#5C5247] mt-0.5 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{invoiceOrder.address}</div>
              </div>
              {/* Items */}
              <div className="mb-1">
                <div className="text-[10px] tracking-widest uppercase text-[#C9A96E] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Rincian Pesanan</div>
                <div className="border border-[#F0EBE1] rounded-xl overflow-hidden">
                  <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <thead className="bg-[#F5F0E8]">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-[#8B7D72]">Produk</th>
                        <th className="text-center px-3 py-2.5 text-[10px] uppercase tracking-wide text-[#8B7D72]">Qty</th>
                        <th className="text-right px-4 py-2.5 text-[10px] uppercase tracking-wide text-[#8B7D72]">Harga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {invoiceOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <div className="text-sm text-[#2C2520]">
                              {item.name}
                              {item.size && <span className="ml-1 text-[10px] text-[#C9A96E]">[{item.size}]</span>}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[item.category]}`}>
                                {CATEGORY_LABELS[item.category]}
                              </span>
                              <span className="text-[11px] text-[#8B7D72]">{item.brand}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center text-sm text-[#5C5247]">×{item.qty}</td>
                          <td className="px-4 py-3 text-right text-sm text-[#2C2520]">{rp(item.price * item.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Totals */}
              <div className="mt-3 space-y-1.5 px-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex justify-between text-sm text-[#8B7D72]">
                  <span>Subtotal</span><span>{rp(invoiceOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#8B7D72]">
                  <span>Ongkos Kirim</span>
                  <span className={invoiceOrder.shippingStatus === 'tbd' ? 'text-amber-500 italic' : ''}>
                    {invoiceOrder.shippingStatus === 'tbd' ? 'Dikonfirmasi' : rp(invoiceOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#2C2520] text-[#2C2520]">
                  <span>TOTAL</span><span>{rp(invoiceOrder.total)}</span>
                </div>
              </div>
              {(invoiceOrder.payment || invoiceOrder.note) && (
                <div className="mt-4 p-3 bg-[#FAF8F4] rounded-xl space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {invoiceOrder.payment && (
                    <div className="flex gap-2 text-xs text-[#5C5247]">
                      <span className="text-[#8B7D72] min-w-[80px]">Pembayaran</span>
                      <span>{invoiceOrder.payment}</span>
                    </div>
                  )}
                  {invoiceOrder.note && (
                    <div className="flex gap-2 text-xs text-[#5C5247]">
                      <span className="text-[#8B7D72] min-w-[80px]">Catatan</span>
                      <span>{invoiceOrder.note}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-5 pt-4 border-t border-[#E0D8CC] text-center">
                <div className="text-[#2C2520]" style={{ fontStyle: 'italic', fontSize: '1rem' }}>
                  Terima kasih sudah berbelanja! <span style={{ color: '#C9A96E' }}>✨</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <button onClick={() => printInvoice(invoiceOrder)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2C2520] text-white rounded-xl text-sm hover:bg-[#C9A96E] transition-colors">
                <Printer size={15} /> Cetak / Simpan PDF
              </button>
              <a href={`https://wa.me/${invoiceOrder.phone.replace(/\D/g, '')}?text=${encodeURIComponent(buildWaInvoice(invoiceOrder))}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white rounded-xl text-sm hover:bg-[#22c35e] transition-colors">
                <Send size={15} /> Kirim via WA
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAMBAH PESANAN MODAL */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#2C2520]">
              <div>
                <div className="text-[#C9A96E] text-xs tracking-widest uppercase">Admin</div>
                <div className="text-white text-sm mt-0.5">Tambah Pesanan Manual</div>
              </div>
              <button onClick={() => setShowAdd(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

              {/* ID Preview */}
              {draftItems.length > 0 && (
                <div className="bg-[#F5F0E8] rounded-xl px-4 py-3 flex items-center gap-3">
                  <Package size={16} className="text-[#C9A96E]" />
                  <div>
                    <div className="text-[10px] text-[#8B7D72] uppercase tracking-wide">ID Pesanan akan dibuat</div>
                    <div className={`text-sm font-mono ${idColor(generateOrderId(draftItems))}`}>
                      {generateOrderId(draftItems)} <span className="text-[#8B7D72] text-xs">(auto-generate saat simpan)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Pelanggan */}
              <div>
                <h3 className="text-sm text-[#2C2520] mb-3 pb-2 border-b border-[#F0EBE1]">Info Pelanggan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Nama *</label>
                    <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nama pelanggan" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>No. HP / WA *</label>
                    <input value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="08xx-xxxx-xxxx" className={inp} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={lbl}>Alamat</label>
                    <textarea value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))}
                      rows={2} placeholder="Alamat lengkap pengiriman" className={inp + ' resize-none'} />
                  </div>
                  <div>
                    <label className={lbl}>Metode Pembayaran</label>
                    <select value={addForm.payment} onChange={e => setAddForm(f => ({ ...f, payment: e.target.value }))}
                      className={inp}>
                      {paymentOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Catatan</label>
                    <input value={addForm.note} onChange={e => setAddForm(f => ({ ...f, note: e.target.value }))}
                      placeholder="Catatan opsional" className={inp} />
                  </div>
                </div>
              </div>

              {/* Item Pesanan */}
              <div>
                <h3 className="text-sm text-[#2C2520] mb-3 pb-2 border-b border-[#F0EBE1]">
                  Item Pesanan <span className="text-[#8B7D72] text-xs">({draftItems.length} item)</span>
                </h3>

                {/* Item yang sudah ditambah */}
                {draftItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {draftItems.map(di => (
                      <div key={di.id} className="flex items-center gap-3 bg-[#FAF8F4] rounded-xl px-3 py-2.5 text-sm">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${CATEGORY_COLORS[di.category]}`}>
                          {CATEGORY_LABELS[di.category]}{di.category === 'decant' && di.size ? ` ${di.size}` : ''}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[#2C2520]">{di.name}</span>
                          <span className="text-[#8B7D72] ml-1 text-xs">{di.brand}</span>
                        </div>
                        <span className="text-[#8B7D72] text-xs">×{di.qty}</span>
                        <span className="text-[#2C2520] text-xs whitespace-nowrap">
                          {rp((parseInt(di.price, 10) || 0) * (parseInt(di.qty, 10) || 1))}
                        </span>
                        <button onClick={() => setDraftItems(prev => prev.filter(d => d.id !== di.id))}
                          className="text-[#8B7D72] hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form tambah item */}
                <div className="border border-dashed border-[#E0D8CC] rounded-xl p-4 space-y-3">
                  <div className="text-xs text-[#8B7D72] uppercase tracking-wide">+ Tambah Item</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="col-span-2 sm:col-span-1">
                      <label className={lbl}>Kategori</label>
                      <select value={newItem.category}
                        onChange={e => setNewItem(n => ({ ...n, category: e.target.value as OrderCategory }))}
                        className={inp}>
                        <option value="decant">Decant</option>
                        <option value="bnib">BNIB</option>
                        <option value="preloved">Preloved</option>
                      </select>
                    </div>
                    {newItem.category === 'decant' && (
                      <div>
                        <label className={lbl}>Ukuran</label>
                        <select value={newItem.size}
                          onChange={e => setNewItem(n => ({ ...n, size: e.target.value }))}
                          className={inp}>
                          <option value="2ml">2ml</option>
                          <option value="5ml">5ml</option>
                          <option value="10ml">10ml</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className={lbl}>Qty</label>
                      <input type="number" min="1" value={newItem.qty}
                        onChange={e => setNewItem(n => ({ ...n, qty: e.target.value }))}
                        className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className={lbl}>Nama Produk *</label>
                      <input value={newItem.name} onChange={e => setNewItem(n => ({ ...n, name: e.target.value }))}
                        placeholder="Contoh: Sauvage EDP" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Brand</label>
                      <input value={newItem.brand} onChange={e => setNewItem(n => ({ ...n, brand: e.target.value }))}
                        placeholder="Contoh: Dior" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Harga Satuan (Rp) *</label>
                      <input value={newItem.price} onChange={e => setNewItem(n => ({ ...n, price: e.target.value.replace(/\D/g, '') }))}
                        placeholder="Contoh: 850000" className={inp} />
                    </div>
                  </div>
                  <button onClick={addDraftItem}
                    disabled={!newItem.name || !newItem.price}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2C2520] text-white rounded-lg text-xs hover:bg-[#C9A96E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <Plus size={13} /> Tambahkan Item Ini
                  </button>
                </div>

                {/* Subtotal preview */}
                {draftItems.length > 0 && (
                  <div className="text-right text-sm mt-2 text-[#5C5247]">
                    Subtotal: <span className="text-[#2C2520]">
                      {rp(draftItems.reduce((s, d) => s + (parseInt(d.price, 10) || 0) * (parseInt(d.qty, 10) || 1), 0))}
                    </span>
                    <div className="text-xs text-[#8B7D72]">Ongkir dikonfirmasi setelah pesanan masuk</div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-[#E0D8CC] text-[#5C5247] rounded-xl text-sm hover:bg-[#FAF8F4] transition-colors">
                Batal
              </button>
              <button onClick={submitAddOrder}
                disabled={!addForm.name || !addForm.phone || draftItems.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2C2520] text-white rounded-xl text-sm hover:bg-[#C9A96E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Plus size={15} /> Buat Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}