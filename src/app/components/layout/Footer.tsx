import React from 'react';
import { Link } from 'react-router';
import { Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2C2520] text-[#E0D8CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-[0.15em] text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                your.i scent
              </div>
              <div className="text-[9px] tracking-[0.3em] text-[#C9A96E] uppercase mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Decant · Preloved · BNIB
              </div>
            </div>
            <p className="text-sm text-[#8B7D72] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Temukan aroma khasmu. Dari decant, preloved, hingga BNIB — semua parfum original terpercaya.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#5C5247] flex items-center justify-center text-[#8B7D72] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#5C5247] flex items-center justify-center text-[#8B7D72] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-white text-sm font-medium tracking-widest uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Kategori</h4>
            <ul className="space-y-3">
              {[
                { to: '/catalog?cat=decant', label: 'Decant' },
                { to: '/catalog?cat=preloved', label: 'Preloved' },
                { to: '/catalog?cat=bnib', label: 'BNIB' },
                { to: '/quiz', label: 'Quiz Aroma' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#8B7D72] hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white text-sm font-medium tracking-widest uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Info</h4>
            <ul className="space-y-3">
              {[
                { to: '/about', label: 'Tentang Kami' },
                { to: '/contact', label: 'Hubungi Kami' },
                { to: '/about#how', label: 'Cara Pemesanan' },
                { to: '/admin', label: 'Admin Panel' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#8B7D72] hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white text-sm font-medium tracking-widest uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Kontak</h4>
            <ul className="space-y-4">
              <li>
                <div className="text-sm text-[#E0D8CC] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>WhatsApp</div>
                <a href="https://wa.me/6281234567890" className="text-xs text-[#8B7D72] hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>+62 812 3456 7890</a>
              </li>
              <li>
                <div className="text-sm text-[#E0D8CC] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Instagram</div>
                <a href="https://instagram.com/your.i_scent" className="text-xs text-[#8B7D72] hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>@your.i_scent</a>
              </li>
              <li>
                <div className="text-sm text-[#E0D8CC] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Lokasi</div>
                <p className="text-xs text-[#8B7D72]" style={{ fontFamily: "'Inter', sans-serif" }}>Embung Tambak Boyo, Sleman, DIY</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3C3327] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#5C5247]" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 your.i scent. All rights reserved.
          </p>
          <p className="text-xs text-[#5C5247]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Original · Terpercaya · Transparan
          </p>
        </div>
      </div>
    </footer>
  );
}