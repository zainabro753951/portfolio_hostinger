import { motion } from 'motion/react'
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header'
import SkillsTable from './components/SkillsTable'
import SkillsForm from './components/SkillsForm'

const glassClass = `md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full`

const DSkillsPage = () => {
  const fadeIn = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45 } },
  }

  return (
    <>
      <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw]">
        {/* About Form */}
        <div
          className={
            'grid md:grid-cols-3 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] place-items-start'
          }
        >
          {/* Skills showcase */}
          <motion.div
            variants={fadeIn}
            initial={'hidden'}
            animate={'show'}
            transition={{
              duration: 0.9,
              ease: 'anticipate',
            }}
            className={glassClass}
          >
            <h3 className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold">
              All Skills
            </h3>
            <SkillsTable />
          </motion.div>
          {/* Add Skills */}
          <motion.div
            variants={fadeIn}
            initial={'hidden'}
            animate={'show'}
            transition={{
              duration: 0.9,
              ease: 'anticipate',
            }}
            className={glassClass + ' md:col-span-2 '}
          >
            <h3 className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold">
              Add Skills
            </h3>
            <SkillsForm />
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default DSkillsPage
