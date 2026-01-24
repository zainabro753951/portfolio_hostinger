import React from 'react'
import { NavLink } from 'react-router-dom'
import GardientButton from './GardientButton'
import { useCursorHoverContext } from '../context/CursorHover'

const Nav = ({ flex = false, isMobile = false }) => {
  const { onCursorEnter, onCursorLeave } = useCursorHoverContext()
  const links = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'About',
      path: '/about',
    },
    {
      name: 'Services',
      path: '/services',
    },
    {
      name: 'Projects',
      path: '/projects',
    },
    {
      name: 'Reviews',
      path: '/reviews',
    },
  ]
  return (
    <nav
      className={`${isMobile ? 'xs:flex md:hidden' : 'md:flex xs:hidden'} ${
        flex ? 'flex-col' : 'items-center'
      }  md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] md:text-[1.25vw] sm:text-[2.3vw] xs:text-[4.3vw]`}
    >
      {links.map((link, idx) => {
        return (
          <NavLink
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
            className={`md:px-[1vw] sm:px-[1.5vw] xs:px-[2vw] transition-all duration-300 hover:text-theme-cyan`}
            to={link.path}
            key={idx}
          >
            {link.name}
          </NavLink>
        )
      })}
      <GardientButton sizeY="short" text="Contact" link="/contact" />
    </nav>
  )
}

export default Nav
