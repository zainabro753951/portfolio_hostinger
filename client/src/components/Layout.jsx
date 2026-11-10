import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => (
  <div className="min-h-screen overflow-x-clip bg-surface-base text-ink">
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-xl border border-line-strong bg-surface-elevated px-4 py-2.5 text-sm font-semibold text-ink transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
    >
      Skip to main content
    </a>
    <Navbar />
    <main id="main-content" tabIndex={-1} className="outline-none">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
