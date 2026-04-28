import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { items, updateQty, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center py-20 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <ShoppingCart size={64} className="text-[#E0D8CC] mb-6" />
        <h2 className="text-[#2C2520] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400 }}>Keranjang Kosong</h2>
        <p className="text-[#8B7D72] text-sm mb-8">Belum ada produk di keranjangmu. Yuk mulai belanja!</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2520] text-white rounded-full text-sm hover:bg-[#C9A96E] transition-colors"
        >
          Jelajahi Produk <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const shipping = 15000;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#2C2520] py-12 text-center">
        <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300 }}>Keranjang Belanja</h1>
        <p className="text-[#8B7D72] text-sm mt-1">{items.length} produk dalam keranjang</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const { product, qty } = item;
              return (
                <div key={product.id} className="bg-white rounded-2xl p-4 border border-[#F0EBE1] flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#F5F0E8]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#C9A96E] uppercase tracking-widest">{product.brand}</div>
                    <h3 className="text-sm font-medium text-[#2C2520] line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>{product.name}</h3>
                    {product.size && <p className="text-xs text-[#8B7D72]">{product.size}</p>}
                    {product.condition && <p className="text-xs text-[#8B7D72]">{product.condition}</p>}

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center gap-2 bg-[#F5F0E8] rounded-lg p-1">
                        <button
                          onClick={() => updateQty(product.id, qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#5C5247] hover:text-[#2C2520] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-[#2C2520]">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, qty + 1)}
                          disabled={qty >= product.stock}
                          className="w-7 h-7 flex items-center justify-center text-[#5C5247] hover:text-[#2C2520] transition-colors disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#2C2520]">Rp {(product.price * qty).toLocaleString('id-ID')}</div>
                        {qty > 1 && <div className="text-xs text-[#8B7D72]">Rp {product.price.toLocaleString('id-ID')} / item</div>}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="self-start p-1.5 text-[#8B7D72] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="text-xs text-[#8B7D72] hover:text-red-500 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Kosongkan Keranjang
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#F0EBE1] p-6 sticky top-24">
              <h2 className="text-base font-medium text-[#2C2520] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-[#5C5247] flex-1 min-w-0 pr-2">
                      <span className="line-clamp-1">{item.product.name}</span>
                      <span className="text-xs text-[#8B7D72]"> ×{item.qty}</span>
                    </span>
                    <span className="text-[#2C2520] flex-shrink-0">Rp {(item.product.price * item.qty).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#F0EBE1] pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C5247]">Subtotal</span>
                  <span className="text-[#2C2520]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C5247]">Ongkir (estimasi)</span>
                  <span className="text-[#2C2520]">Rp {shipping.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-t border-[#F0EBE1] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium text-[#2C2520]">Total</span>
                  <span className="font-semibold text-[#2C2520] text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2C2520] text-white rounded-full text-sm hover:bg-[#C9A96E] transition-colors"
              >
                Lanjut ke Checkout <ArrowRight size={16} />
              </button>

              <Link
                to="/catalog"
                className="block text-center mt-3 text-xs text-[#8B7D72] hover:text-[#C9A96E] transition-colors"
              >
                ← Lanjut Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
