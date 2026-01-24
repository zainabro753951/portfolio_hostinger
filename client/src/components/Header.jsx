import React, { useState } from 'react'
import { IoMdClose, IoMdMenu } from 'react-icons/io'
import { AnimatePresence, motion } from 'motion/react'
import Nav from './Nav'
import { useSelector } from 'react-redux'

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { site_info } = useSelector(state => state.siteSettings)

  const toggleMenu = () => setIsMobileOpen(prev => !prev)

  return (
    <>
      {/* Top Header */}
      <header className="w-full fixed top-0 z-50 bg-theme-dark text-white shadow-lg shadow-theme-purple/20">
        <div className="flex items-center justify-between font-inter md:px-[2.5vw] sm:px-[3vw] xs:px-[4.5vw] md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]">
          {/* Logo */}
          {site_info?.logoImage ? (
            <img
              src={site_info?.logoImage?.url}
              className="md:w-[15vw] sm:w-[30vw] xs:w-[45vw]"
              alt=""
            />
          ) : (
            <h1 className="gradient-text uppercase font-semibold md:text-[1.8vw] sm:text-[2.8vw] xs:text-[5.3vw]">
              {'{ } Stack.dev'}
            </h1>
          )}

          {/* Desktop Nav */}
          <Nav />

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden xs:inline-block cursor-pointer sm:text-[3.5vw] xs:text-[6.5vw]"
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMobileOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, scale: 0.6, rotate: isMobileOpen ? 90 : -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: isMobileOpen ? -90 : 90 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="inline-block"
              >
                {isMobileOpen ? <IoMdClose /> : <IoMdMenu />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed left-0 w-full bg-theme-dark text-white z-40 md:hidden xs:block sm:top-[7.5vw] xs:top-[13.5vw] sm:p-[3vw] xs:p-[4vw]"
          >
            <Nav flex isMobile />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
