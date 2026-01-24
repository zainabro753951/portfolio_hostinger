import React from 'react'
import FAQForm from './components/FAQForm'
import FAQTable from './components/FAQTable'

const DFaqsPage = () => {
  return (
    <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw] flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
      {/* Education Table */}
      <FAQTable />
      {/* Education Form */}
      <FAQForm />
    </section>
  )
}

export default DFaqsPage
