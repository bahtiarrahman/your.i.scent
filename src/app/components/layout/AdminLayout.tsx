import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router';
import { LayoutDashboard, Package, Tag, ClipboardList, CreditCard, LogOut, Menu, ChevronRight, BarChart2, FlaskConical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { admin, adminLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ─── LOGIN DIMATIKAN SEMENTARA ───
  // if (!admin.isLoggedIn && location.pathname !== '/admin/login') {
  //   return <Navigate to="/admin/login" replace />;
  // }

  const navItems = [
    { to: '/admin',               icon: LayoutDashboard, label: 'Dashboard',       exact: true },
    { to: '/admin/products',      icon: Package,         label: 'Produk'                       },
    { to: '/admin/brands',        icon: Tag,             label: 'Brand'                        },
    { to: '/admin/orders',        icon: ClipboardList,   label: 'Pesanan'                      },
    { to: '/admin/payments',      icon: CreditCard,      label: 'Pembayaran'                   },
    // { to: '/admin/rekap',         icon: BarChart2,       label: 'Rekap Penjualan'              }, // ← DIMATIKAN SEMENTARA
    { to: '/admin/quiz-settings', icon: FlaskConical,    label: 'Pengaturan Quiz'              },
  ];

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // ─── LOGIN PAGE CHECK DIMATIKAN ───
  // if (location.pathname === '/admin/login') {
  //   return <Outlet />;
  // }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-[#2C2520] z-50 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#3C3327]">
          <Link to="/" className="block">
            <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-semibold tracking-[0.15em] text-white">
              your.i scent
            </div>
            <div className="text-[9px] tracking-[0.3em] text-[#C9A96E] uppercase mt-0.5">Admin Panel</div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-[#C9A96E] text-white'
                    : 'text-[#8B7D72] hover:bg-[#3C3327] hover:text-[#E0D8CC]'
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-[#3C3327]">
          {/* ─── LOGOUT DIMATIKAN SEMENTARA ─── */}
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-[#8B7D72] hover:bg-[#3C3327] hover:text-[#E0D8CC] transition-all"
          >
            <LogOut size={17} />
            Keluar
          </button> */}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-[#8B7D72] hover:bg-[#3C3327] hover:text-[#E0D8CC] transition-all"
          >
            <ChevronRight size={17} />
            Ke Toko
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E0D8CC] px-4 py-3 flex items-center gap-3 md:gap-4 md:px-8 flex-shrink-0">
          <button className="md:hidden p-2 text-[#5C5247]" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-medium text-[#2C2520] truncate">
              {navItems.find(n => n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label ?? 'Admin Panel'}
            </h1>
          </div>
          <div className="text-sm text-[#8B7D72] flex-shrink-0">Administrator</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}