import React from 'react'
import { Link } from 'react-router-dom'
import { useCursorHoverContext } from '../context/CursorHover'

const BorderedButton = ({ text = 'button', link, sizeY = 'medium' }) => {
  const { onCursorEnter, onCursorLeave } = useCursorHoverContext()
  return (
    <button
      onMouseEnter={onCursorEnter}
      onMouseLeave={onCursorLeave}
      className={` ${
        (sizeY.toLowerCase() == 'short' && 'md:py-[0.6vw] sm:py-[1.6vw] xs:py-[2.6vw]') ||
        (sizeY.toLocaleLowerCase() == 'medium' && 'md:py-[0.9vw] sm:py-[1.9vw] xs:py-[2.9vw]')
      } md:px-[2vw] sm:px-[2.5vw] xs:px-[3vw] md:border-[0.15vw] sm:border-[0.35vw] xs:border-[0.65vw] border-theme-cyan md:rounded-[0.6vw] sm:rounded-[1.1vw] xs:rounded-[1.6vw] hover:bg-theme-cyan transition-all duration-300 gradient-button-shadow `}
    >
      <Link to={link}>{text}</Link>
    </button>
  )
}

export default BorderedButton
