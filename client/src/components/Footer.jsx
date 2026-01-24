import React from 'react'
import { useSelector } from 'react-redux'

const Footer = () => {
  const { site_info } = useSelector(state => state.siteSettings)

  return (
    <footer className="w-full flex items-center justify-center md:py-[3vw] sm:py-[4vw] xs:py-[5vw] border-t border-theme-cyan/30">
      <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-400">
        {site_info?.footerText ? site_info?.footerText : '© 2025 Zain Abro. All rights reserved.'}
      </p>
    </footer>
  )
}

export default Footer
