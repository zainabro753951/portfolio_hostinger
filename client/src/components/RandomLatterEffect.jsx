'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const RandomLettersEffect = () => {
  const containerRef = useRef(null)
  const tweensRef = useRef([])

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const container = containerRef.current
    if (!container) return

    const COUNT = 25 // elements ki tadaad adjust karo

    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span')
      span.textContent = chars[Math.floor(Math.random() * chars.length)]

      // Tailwind classes + performance hint
      span.className =
        'absolute text-white text-3xl font-bold opacity-0 select-none pointer-events-none'
      span.style.willChange = 'opacity, transform'
      span.style.transformOrigin = '50% 50%'

      // --- IMPORTANT: set initial random position BEFORE appending ---
      span.style.top = `${Math.random() * 80 + 10}%` // 10% - 90%
      span.style.left = `${Math.random() * 90 + 5}%` // 5% - 95%

      container.appendChild(span)

      // Smooth show/hide durations
      const duration = 2.5 + Math.random() * 2 // 2.5s - 4.5s
      const delay = Math.random() * 3 // initial stagger
      const repeatDelay = 1 + Math.random() * 2

      // GSAP tween: only opacity & slight scale (no position animation)
      const tween = gsap.to(span, {
        opacity: 1,
        scale: 1.03, // subtle pop; remove if you want no transform
        duration,
        delay,
        ease: 'sine.inOut', // very smooth easing
        yoyo: true,
        repeat: -1,
        repeatDelay,
        onRepeat: () => {
          // change character each cycle (optional)
          span.textContent = chars[Math.floor(Math.random() * chars.length)]
          // NOTE: we DO NOT change top/left here — so elements don't move
        },
      })

      tweensRef.current.push(tween)
    }

    // cleanup on unmount
    return () => {
      tweensRef.current.forEach(t => t.kill())
      tweensRef.current = []
      if (container) container.innerHTML = ''
    }
  }, [])

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background animation container */}
      <div ref={containerRef} className="absolute w-full h-full"></div>

      {/* Your Hero Content */}
      <div className="z-10 text-center pointer-events-auto">
        <h1 className="text-6xl font-extrabold text-white">
          Welcome to <span className="text-green-400">My Portfolio</span>
        </h1>
        <p className="mt-4 text-gray-300 text-lg">Frontend Developer | React | GSAP Enthusiast</p>
      </div>
    </div>
  )
}

export default RandomLettersEffect
