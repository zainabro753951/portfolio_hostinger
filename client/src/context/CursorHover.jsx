import React, { createContext, useContext, useState } from 'react'

const CursorHoverContext = createContext()

export const useCursorHoverContext = () => useContext(CursorHoverContext)

export const CursorHoverProvider = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Handlers
  const onCursorEnter = () => setIsHovered(true)
  const onCursorLeave = () => setIsHovered(false)

  return (
    <CursorHoverContext.Provider
      value={{
        isHovered,
        onCursorEnter,
        onCursorLeave,
      }}
    >
      {children}
    </CursorHoverContext.Provider>
  )
}
