import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/catalog', label: 'Katalog' },
    { to: '/about', label: 'Tentang Kami' },
    { to: '/contact', label: 'Kontak' },
  ];

  const isActive = (to: string) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ('');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FAF8F4]/95 backdrop-blur-md shadow-sm border-b border-[#E0D8CC]' : 'bg-[#FAF8F4]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start">
            <span className="font-['Cormorant_Garamond'] text-xl md:text-2xl font-semibold tracking-[0.15em] text-[#2C2520]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              your.i scent
            </span>
            <span className="text-[9px] tracking-[0.3em] text-[#C9A96E] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
              Decant · Preloved · BNIB
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-[#C9A96E]'
                    : 'text-[#5C5247] hover:text-[#2C2520]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#5C5247] hover:text-[#2C2520] transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-[#5C5247] hover:text-[#2C2520] transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C9A96E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#5C5247]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4">
            <div className="flex items-center gap-2 border border-[#E0D8CC] rounded-full px-4 py-2 bg-white">
              <Search size={16} className="text-[#8B7D72]" />
              <input
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Cari parfum, brand..."
                className="flex-1 outline-none text-sm text-[#2C2520] bg-transparent placeholder-[#8B7D72]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button type="submit" className="text-xs text-[#C9A96E] font-medium">Cari</button>
            </div>
          </form>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#E0D8CC] py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2 py-3 text-sm transition-colors ${
                    isActive(link.to) ? 'text-[#C9A96E]' : 'text-[#5C5247]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[#E0D8CC] mt-2 pt-3">
                <Link to="/contact" className="px-2 py-2 text-sm text-[#5C5247]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Hubungi Kami
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}