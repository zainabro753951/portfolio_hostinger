import React, { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SkillSkeleton from './SkillSkeleton'

gsap.registerPlugin(ScrollTrigger)

const Skills = () => {
  const { data: about, isLoading } = useSelector(state => state.about)
  const { skills = [], isLoading: isSkillLoading } = useSelector(state => state.skills)
  const { experiences = [], isLoading: isExperienceLoading } = useSelector(
    state => state.experience
  )

  const location = useLocation()
  const containerRef = useRef(null)

  // ✅ Check if page should show skeleton
  const isPageLoading = isLoading || isSkillLoading || isExperienceLoading

  // ✅ Memoize data
  const data = useMemo(
    () => ({
      name: about?.fullName || 'Zain Abro',
      desc:
        about?.shortDesc ||
        "I'm a passionate Full Stack Developer specializing in the MERN stack. I love crafting smooth, high-performing, and scalable web experiences with clean UI and interactive animations.",
      work_history: [
        {
          position: 'MERN Stack Developer',
          company: 'Cybrix Company',
          startedAt: '2024',
          endDate: '2025',
          desc: 'Led a team of developers to build a cloud-based SaaS platform using React and AWS.',
        },
        {
          position: 'Full Stack Developer',
          company: 'Tech Stack',
          startedAt: '2023',
          endDate: '2024',
          desc: 'Developed e-commerce platforms using Node.js and MongoDB, improving client performance by 30%.',
        },
      ],
      skills,
    }),
    [about, skills]
  )

  // 🟢 GSAP Progress Animation (run only when page loaded)
  useGSAP(
    () => {
      if (isPageLoading) return // ⛔ Don't animate until loading done

      const skillItems = gsap.utils.toArray('.skill-item')

      skillItems.forEach(skill => {
        const bar = skill.querySelector('.progress-bar')
        const percentText = skill.querySelector('.percent-text')
        if (!bar || !percentText) return

        const targetPercent = parseInt(bar.dataset.percent, 10)
        const counter = { val: 0 }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: skill,
              start: 'top 85%',
              once: true,
            },
          })
          .fromTo(
            bar,
            { width: '0%' },
            { width: `${targetPercent}%`, duration: 1.2, ease: 'power3.out' }
          )
          .to(
            counter,
            {
              val: targetPercent,
              duration: 1.2,
              ease: 'power3.out',
              onUpdate: () => {
                percentText.textContent = `${Math.round(counter.val)}%`
              },
            },
            0
          )
      })
    },
    [skills, isPageLoading] // ✅ Re-run only when data ready
  )

  // 🎬 Framer Motion Variants
  const variants = {
    container: { show: { transition: { staggerChildren: 0.25 } } },
    fadeUp: {
      hidden: { y: 40, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    },
    fadeRight: {
      hidden: { x: 60, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    },
  }

  // ⏳ Show skeleton while loading
  if (isPageLoading) return <SkillSkeleton />

  return (
    <motion.section
      ref={containerRef}
      key={location.pathname}
      variants={variants.container}
      initial="hidden"
      {...(location.pathname === '/'
        ? { whileInView: 'show', viewport: { once: true, amount: 0.3 } }
        : { animate: 'show' })}
      className="w-full min-h-screen bg-theme-dark text-white font-inter md:py-[10vw] sm:py-[15vw] xs:py-[20vw] md:px-[3vw] sm:px-[5vw] xs:px-[6vw] overflow-hidden"
    >
      <div className="grid md:grid-cols-2 items-center md:gap-[5vw] sm:gap-[6vw] xs:gap-[8vw]">
        {/* 🧠 Left Section */}
        <motion.div
          variants={variants.container}
          className="flex flex-col md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw]"
        >
          {/* 👤 Intro */}
          <motion.div variants={variants.fadeUp}>
            <h2 className="font-fira-code font-semibold md:text-[2.5vw] sm:text-[3.5vw] xs:text-[6vw] text-theme-cyan">
              {data.name}
            </h2>
            <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.2vw] text-gray-300 mt-[1vw] leading-relaxed">
              {data.desc}
            </p>
          </motion.div>

          {/* 💼 Work History */}
          <motion.div variants={variants.fadeUp}>
            <h3 className="font-fira-code font-semibold md:text-[1.7vw] sm:text-[2.7vw] xs:text-[4.7vw] mb-[1vw]">
              Work History
            </h3>
            {experiences?.map((item, idx) => {
              const startedAt = new Date(item?.startedAt).toLocaleDateString('en-PK', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })

              const endDate = item?.endDate
                ? new Date(item?.endDate).toLocaleDateString('en-PK', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })
                : item?.currentlyWorking

              return (
                <motion.div
                  key={idx}
                  variants={variants.fadeUp}
                  className="text-gray-300 md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] mb-[1vw]"
                >
                  <p>
                    <span className="text-theme-cyan font-medium">
                      {item.position}, {item.company}
                    </span>{' '}
                    <span className="text-gray-400">
                      ({startedAt} - {endDate})
                    </span>
                  </p>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* 🧩 Skills */}
          <motion.div variants={variants.fadeUp}>
            <h3 className="font-fira-code font-semibold md:text-[1.7vw] sm:text-[2.7vw] xs:text-[4.7vw] mb-[1vw]">
              Skills
            </h3>

            <div className="flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              {data.skills.map((item, idx) => (
                <div key={idx} className="skill-item flex flex-col gap-1.5">
                  <div className="flex justify-between items-center md:text-[1.2vw] sm:text-[2.3vw] xs:text-[4.3vw]">
                    <p className="text-theme-cyan font-medium capitalize">{item.skillName}</p>
                    <p className="percent-text text-gray-300">0%</p>
                  </div>

                  <div className="w-full bg-gray-700/40 rounded-full overflow-hidden relative md:h-[1vw] sm:h-[1.8vw] xs:h-[2.5vw] shadow-inner">
                    <div
                      className="progress-bar absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-r-full"
                      data-percent={item.proficiency}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* 🖼️ Right Section */}
        <motion.div
          variants={variants.fadeRight}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          className="w-full border border-theme-cyan/60 md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] overflow-hidden bg-gradient-to-br from-[#0a0a2a]/60 to-[#0b1a2a]/80"
        >
          <img
            src="/imgs/about.jpg"
            alt="about"
            className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Skills
