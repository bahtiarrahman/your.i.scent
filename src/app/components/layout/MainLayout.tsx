import React from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4]">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
