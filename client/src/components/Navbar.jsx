import BrandLogo from '@/components/ds/BrandLogo';
import { EASE_OUT, useMotionPrefs } from '@/lib/motion';
import { NAV_LINKS } from '@/lib/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base';

const isActivePath = (pathname, path) =>
  path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { reduced, isMobile } = useMotionPrefs();

  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const wasOpenRef = useRef(false);

  // Scroll state (state only flips at the threshold → no re-render spam)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Scroll lock, Escape to close, focus trap, focus restore
  useEffect(() => {
    if (!isMenuOpen) {
      if (wasOpenRef.current) toggleRef.current?.focus();
      wasOpenRef.current = false;
      return undefined;
    }
    wasOpenRef.current = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab' || !menuRef.current) return;
      const focusables = menuRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === menuRef.current) {
        e.preventDefault();
        last.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  const dur = reduced ? 0.01 : undefined;
  const itemDelay = isMobile ? 0.04 : 0.07;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: reduced ? 0 : -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur ?? 0.6, ease: EASE_OUT }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 motion-reduce:transition-none ${
          isScrolled || isMenuOpen
            ? 'border-line-subtle bg-surface-base/80 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8"
        >
          <BrandLogo className="relative z-50" />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex xl:gap-2">
            {NAV_LINKS.map(({ name, path }) => {
              const active = isActivePath(pathname, path);
              return (
                <li key={path}>
                  <Link
                    to={path}
                    aria-current={active ? 'page' : undefined}
                    className={`relative block rounded-lg px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300 motion-reduce:transition-none ${FOCUS_RING} ${
                      active ? 'text-brand-cyan' : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {name}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-cyan"
                        transition={
                          reduced
                            ? { duration: 0.01 }
                            : { type: 'spring', stiffness: 380, damping: 32 }
                        }
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <Link
            to="/contact"
            aria-label="Hire me for a project"
            className={`hidden min-h-10 items-center rounded-xl bg-[image:var(--gradient-cyan-blue)] px-5 text-sm font-semibold text-surface-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(var(--brand-cyan)/0.55)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:inline-flex ${FOCUS_RING}`}
          >
            Hire Me
          </Link>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className={`relative z-50 grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-subtle bg-surface-card/60 text-ink transition-colors duration-300 hover:border-line-strong lg:hidden ${FOCUS_RING}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: reduced ? 0 : -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: reduced ? 0 : 45 }}
                transition={{ duration: dur ?? 0.15 }}
                className="grid place-items-center"
              >
                {isMenuOpen ? (
                  <X size={22} aria-hidden="true" />
                ) : (
                  <Menu size={22} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            tabIndex={-1}
            className="fixed inset-0 z-40 outline-none lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur ?? 0.25 }}
              className="absolute inset-0 bg-surface-void/80 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden="true"
            />

            <motion.div
              initial={reduced ? { opacity: 0 } : { x: '100%' }}
              animate={reduced ? { opacity: 1 } : { x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: dur ?? 0.4, ease: EASE_OUT }}
              className="absolute right-0 top-0 flex h-full w-full flex-col overflow-y-auto border-l border-line-subtle bg-surface-elevated px-4 pb-8 pt-24 sm:w-80 sm:px-6"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map(({ name, path }, index) => {
                  const active = isActivePath(pathname, path);
                  return (
                    <motion.li
                      key={path}
                      initial={{ opacity: 0, x: reduced ? 0 : 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: dur ?? 0.35, ease: EASE_OUT, delay: 0.1 + index * itemDelay }}
                    >
                      <Link
                        to={path}
                        onClick={closeMenu}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-12 items-center rounded-xl px-4 text-lg font-medium transition-colors duration-200 ${FOCUS_RING} ${
                          active
                            ? 'bg-brand-cyan/10 text-brand-cyan'
                            : 'text-ink hover:bg-white/5'
                        }`}
                      >
                        {name}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: dur ?? 0.3, delay: 0.1 + NAV_LINKS.length * itemDelay }}
                className="mt-6 border-t border-line-subtle pt-6"
              >
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className={`flex min-h-12 w-full items-center justify-center rounded-xl bg-[image:var(--gradient-cyan-blue)] px-6 text-base font-semibold text-surface-base transition-opacity hover:opacity-90 ${FOCUS_RING}`}
                >
                  Hire Me
                </Link>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navbar);
