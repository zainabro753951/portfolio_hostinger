import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { useSelector } from "react-redux";
import Nav from "./Nav";

const HeaderModern = () => {
  const { site_info } = useSelector((s) => s.siteSettings || {});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const menuRef = useRef(null);

  console.log(site_info);

  // Close menu on Escape and trap focus when open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false);
      if (e.key === "Tab" && isMobileOpen && menuRef.current) {
        // Basic focus trap: keep focus inside menu
        const focusable = menuRef.current.querySelectorAll(
          'a, button, input, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
  }, [isMobileOpen]);

  const toggleMenu = () => setIsMobileOpen((v) => !v);

  const backdropVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 0.45 },
    exit: { opacity: 0 },
  };

  const panelVariants = {
    hidden: {
      y: "-8%",
      opacity: 0,
      scale: 0.98,
    },
    show: {
      y: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 28,
        mass: 0.6,
      },
    },
    exit: {
      y: "-6%",
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.18, ease: "easeInOut" },
    },
  };

  return (
    <>
      {/* sticky glass header */}
      <header className="fixed left-0 right-0 top-0 z-50 text-white">
        <div className="backdrop-blur-md/60 sticky top-0 mx-auto w-full bg-linear-to-b from-white/2 to-transparent backdrop-blur-xl border-b border-white/6 shadow-lg">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex md:h-16 items-center justify-between gap-4 md:py-3 xs:py-1">
              {/* Logo area */}
              <div className="flex items-center gap-4">
                {site_info?.logoImage?.url ? (
                  <img
                    src={`https://zaincode.io${site_info?.logoImage?.url}`}
                    alt={site_info?.siteName || "logo"}
                    className="md:h-12 xs:h-8 w-auto rounded-sm object-contain"
                  />
                ) : (
                  <div className="rounded-md bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 font-semibold text-lg">
                    {site_info?.siteName || "{ } Stack.dev"}
                  </div>
                )}
              </div>

              {/* Desktop nav (hidden on small) */}
              <div className="hidden md:flex md:items-center md:justify-center md:gap-8">
                <Nav underlineAnimated />
              </div>

              {/* action area (desktop) + mobile toggle */}
              <div className="flex items-center gap-4">
                {/* CTAs for larger screens */}
                <div className="hidden md:flex md:items-center md:gap-3">
                  <a
                    href="/projects"
                    className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-medium shadow-md hover:translate-y-[-2px] transition-transform"
                  >
                    Projects
                  </a>
                  <a
                    href="/contact"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/3 transition"
                  >
                    Contact
                  </a>
                </div>

                {/* Mobile toggle */}
                <button
                  onClick={toggleMenu}
                  aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/8 bg-white/3 md:hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isMobileOpen ? "close" : "menu"}
                      initial={{
                        opacity: 0,
                        rotate: isMobileOpen ? 90 : -90,
                        scale: 0.6,
                      }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        rotate: isMobileOpen ? -90 : 90,
                        scale: 0.6,
                      }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="text-xl"
                    >
                      {isMobileOpen ? <IoMdClose /> : <IoMdMenu />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* mobile panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden "
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              className="absolute inset-0 bg-black"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sliding Panel */}
            <motion.aside
              ref={menuRef}
              variants={panelVariants}
              className="relative z-50 mx-auto mt-2 w-[94%] rounded-2xl
          bg-linear-to-b from-[#071022]/95 via-[#061022]/95 to-[#030408]/98
          p-6 pt-12 shadow-2xl will-change-transform text-white "
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {site_info?.logoImage ? (
                    <img
                      src={site_info.logoImage.url}
                      alt="logo"
                      className="h-8 w-auto"
                    />
                  ) : (
                    <div className="font-semibold text-lg">
                      {site_info?.siteName || "{ } Stack.dev"}
                    </div>
                  )}
                </div>
              </div>

              {/* Nav */}
              <nav className="mt-8 flex flex-col gap-4">
                <Nav flex isMobile onClickLink={() => setIsMobileOpen(false)} />
              </nav>

              {/* CTA */}
              <div className="mt-6 border-t border-white/6 pt-6 flex flex-col gap-3">
                <a
                  href="/projects"
                  className="rounded-full bg-linear-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-center font-medium"
                >
                  View Projects
                </a>
                <a
                  href="/contact"
                  className="rounded-full border border-white/8 px-4 py-3 text-center"
                >
                  Contact
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderModern;
