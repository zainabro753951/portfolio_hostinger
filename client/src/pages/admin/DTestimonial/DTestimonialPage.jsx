import { motion } from 'motion/react'
import DTestimonialForm from './components/DTestimonialForm'
import DTestimonialTable from './components/DTestimonialTable'

const DTestimonialPage = () => {
  return (
    <>
      <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw] flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
        {/* Testimonial Table */}
        <DTestimonialTable />
        {/* Testimonial Form */}
        <DTestimonialForm />
      </section>
    </>
  )
}

export default DTestimonialPage
