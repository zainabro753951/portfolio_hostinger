import { motion } from 'motion/react'
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header'
import AboutForm from './components/AboutForm'

const DAboutPage = () => {
  return (
    <>
      <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw]">
        {/* About Form */}
        <AboutForm />
      </section>
    </>
  )
}

export default DAboutPage
