import { createBrowserRouter } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage'; // ← TIDAK DIPAKAI
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminBrands } from './pages/admin/AdminBrands';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminRekap } from './pages/admin/AdminRekap'; // ← TIDAK DIPAKAI
import { AdminQuizSettings } from './pages/admin/quiz/AdminQuizSettings';
import { DesignSystemPage } from './pages/DesignSystemPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'catalog', Component: CatalogPage },
      { path: 'product/:id', Component: ProductPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'quiz', Component: QuizPage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      // ── hidden route — design system docs (not in navbar) ──
      { path: 'design-system', Component: DesignSystemPage },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      // { path: 'login', Component: AdminLoginPage }, // ← LOGIN DIMATIKAN
      { path: 'products', Component: AdminProducts },
      { path: 'brands', Component: AdminBrands },
      { path: 'orders', Component: AdminOrders },
      { path: 'payments', Component: AdminPayments },
      // { path: 'rekap', Component: AdminRekap }, // ← REKAP DIMATIKAN
      { path: 'quiz-settings', Component: AdminQuizSettings },
    ],
  },
]);