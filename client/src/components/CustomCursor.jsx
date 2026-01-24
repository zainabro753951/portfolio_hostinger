import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import { useCursorHoverContext } from '../context/CursorHover'

gsap.registerPlugin(useGSAP)

const CustomCursor = () => {
  const { isHovered } = useCursorHoverContext()
  const cursor = useRef(null)
  const shadowTl = useRef(null)

  useGSAP(() => {
    // Smooth movement
    const xTo = gsap.quickTo(cursor.current, 'x', {
      duration: 0.3,
      ease: 'power3.out',
    })
    const yTo = gsap.quickTo(cursor.current, 'y', {
      duration: 0.3,
      ease: 'power3.out',
    })

    const cursorMove = e => {
      const rect = cursor.current.getBoundingClientRect()
      const targetX = e.clientX - rect.width / 2
      const targetY = e.clientY - rect.height / 2

      xTo(targetX)
      yTo(targetY)
    }

    document.addEventListener('mousemove', cursorMove)
    return () => document.removeEventListener('mousemove', cursorMove)
  })

  useEffect(() => {
    if (!cursor.current) return

    if (isHovered) {
      // Shadow pulse animation
      shadowTl.current = gsap.timeline({ repeat: -1, yoyo: true })
      shadowTl.current.to(cursor.current, {
        boxShadow: '0 0 25px 10px rgba(146, 53, 234, 0.6)',
        duration: 0.3,
        ease: 'easeInOut',
      })
    } else {
      // Kill shadow animation when not hovered
      if (shadowTl.current) {
        shadowTl.current.kill()
        shadowTl.current = null
      }
      gsap.set(cursor.current, { boxShadow: 'none' })
    }
  }, [isHovered])

  return (
    <motion.div
      ref={cursor}
      initial={{
        width: 18,
        height: 18,
        borderColor: '#06b6d4',
      }}
      animate={{
        width: isHovered ? 50 : 18,
        height: isHovered ? 50 : 18,
        borderColor: isHovered ? '#9235ea' : '#06b6d4',
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
      }}
      className="pointer-events-none fixed z-[60] rounded-full border-2
                 will-change-transform md:block xs:hidden"
      style={{ left: 0, top: 0 }}
    />
  )
}

export default CustomCursor
