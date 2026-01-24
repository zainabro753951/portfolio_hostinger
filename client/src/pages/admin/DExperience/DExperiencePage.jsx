import React from 'react'
import ExpForm from './Components/ExpForm'
import ExpTable from './Components/ExpTable'

const DExperiencePage = () => {
  return (
    <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw] flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
      {/* Education Table */}
      <ExpTable />
      {/* Education Form */}
      <ExpForm />
    </section>
  )
}

export default DExperiencePage
