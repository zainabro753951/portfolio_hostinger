import React, { useRef, useState } from 'react'
import { IoCodeSlash } from 'react-icons/io5'
import { TbFolderCheck } from 'react-icons/tb'
import { HiUsers } from 'react-icons/hi2'
import { PiBracketsCurlyBold } from 'react-icons/pi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import CodeBlock from './CodeBlock'
import { useSelector } from 'react-redux'
import { backendSkillFilter, frontendSkillFilter } from '../../../Utils/Utils'
import AboutSkeleton from './AboutSkeleton'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const About = () => {
  const { skills, isLoading: isSkillLoading } = useSelector(state => state.skills)
  const { data: about, isLoading: isAboutLoading } = useSelector(state => state.about)
  const { projects, isLoading: isProjectLoading } = useSelector(state => state.projects)

  const isPageLoading = isSkillLoading || isAboutLoading || isProjectLoading

  const skillNames = skills?.map(item => item.skillName)
  const DoneProjects = projects?.filter(
    i => i.visibility.toLowerCase() === 'public' && i.status.toLowerCase() === 'published'
  ).length

  const frontendSkills = frontendSkillFilter(skillNames)
  const backendSkills = backendSkillFilter(skillNames)

  const experience = [
    { icon: <IoCodeSlash />, title: 5, suffix: '+', subTitle: 'Years Coding' },
    { icon: <TbFolderCheck />, title: DoneProjects, suffix: '+', subTitle: 'Projects Done' },
    { icon: <HiUsers />, title: 135, suffix: '+', subTitle: 'Happy Clients' },
    { icon: <PiBracketsCurlyBold />, title: 100, suffix: '%', subTitle: 'Code Quality' },
  ]

  const containerRef = useRef(null)
  const countersRef = useRef([])

  // ✅ FIX: Run GSAP only after data is loaded
  useGSAP(
    () => {
      if (isPageLoading) return // ⛔ Skip animation when loading

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        },
      })

      experience.forEach((item, i) => {
        const el = countersRef.current[i]
        if (!el) return
        const obj = { val: 0 }

        tl.to(
          obj,
          {
            val: item.title,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              el.innerText = Math.floor(obj.val).toLocaleString()
            },
            onComplete: () => {
              el.innerText = item.title.toLocaleString() + (item.suffix ?? '')
            },
          },
          i * 0.2
        )
      })
    },
    { scope: containerRef, dependencies: [isPageLoading] } // ✅ Re-run when loading state changes
  )

  // ✅ Framer Motion Variants
  const animations = {
    container: {
      hidden: {},
      show: {
        transition: { staggerChildren: 0.25 },
      },
    },
    fadeUp: {
      hidden: { y: 60, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
      },
    },
  }

  const myCode = `
class About {
  name: "${about?.fullName}",
  role: "${about?.shortRole}",
  skills: {
    frontend: [
      ${frontendSkills?.map(skill => `"${skill}"`).join(',\n      ')}
    ],
    backend: [
      ${backendSkills?.map(skill => `"${skill}"`).join(',\n      ')}
    ]
  }
}
`

  // ✅ Show skeleton until fully loaded
  if (isPageLoading) return <AboutSkeleton />

  // ✅ Only render this when fully ready (ensures motion + GSAP run correctly)
  return (
    <motion.div
      ref={containerRef}
      variants={animations.container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-dark w-full text-white font-inter overflow-hidden"
    >
      <div className="w-full h-full grid md:grid-cols-2 md:gap-[2.5vw] sm:gap-[3.5vw] xs:gap-[4.5vw] items-center">
        {/* 🧩 Experience Cards */}
        <motion.div
          variants={animations.container}
          className="grid md:grid-cols-2 md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw]"
        >
          {experience.map((item, idx) => (
            <motion.div
              key={idx}
              variants={animations.fadeUp}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
              }}
              transition={{ duration: 0.3 }}
              className="md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button"
            >
              <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col">
                <span className="md:text-[4vw] sm:text-[5vw] xs:text-[7.5vw] text-theme-cyan">
                  {item.icon}
                </span>
                <h3
                  ref={el => (countersRef.current[idx] = el)}
                  className="md:text-[2vw] sm:text-[3vw] xs:text-[5.5vw] font-semibold font-fira-code py-1"
                >
                  0
                </h3>
                <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-400">
                  {item.subTitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🧠 Code Block Section */}
        <motion.div variants={animations.fadeUp}>
          <CodeBlock code={myCode} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About
