import React from 'react'
import { Link } from 'react-router-dom'
import { useCursorHoverContext } from '../context/CursorHover'

const GradientButton = ({
  text = 'Button',
  link = '/',
  sizeY = 'medium',
  hoverShadow = false,
  hoverOpacity = true,
  type = 'button',
  onClick, // optional for button
}) => {
  const { onCursorEnter, onCursorLeave } = useCursorHoverContext()

  const sizeClass =
    sizeY.toLowerCase() === 'short'
      ? 'md:py-[0.6vw] sm:py-[1.6vw] xs:py-[2.6vw]'
      : 'md:py-[0.9vw] sm:py-[1.9vw] xs:py-[2.9vw]'

  const classes = `
    ${sizeClass}
    md:px-[2vw] sm:px-[2.5vw] xs:px-[3vw]
    gradient-button
    md:rounded-[0.6vw] sm:rounded-[1.1vw] xs:rounded-[1.6vw]
    transition-all duration-300
    ${hoverOpacity ? 'hover:opacity-90' : ''}
    ${hoverShadow ? 'gradient-button-shadow' : ''}
    flex justify-center items-center
  `

  if (type === 'submit') {
    // Render button for form submission
    return (
      <button
        type="submit"
        onMouseEnter={onCursorEnter}
        onMouseLeave={onCursorLeave}
        className={classes}
      >
        {text}
      </button>
    )
  }

  // Render Link if type is "button"
  return (
    <Link
      to={link}
      onClick={onClick}
      onMouseEnter={onCursorEnter}
      onMouseLeave={onCursorLeave}
      className={classes}
    >
      {text}
    </Link>
  )
}

export default GradientButton
