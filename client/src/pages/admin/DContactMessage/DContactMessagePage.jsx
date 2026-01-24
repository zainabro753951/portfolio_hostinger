import React from 'react'
import ContactMessageHeader from './components/ContactMessageHeader'
import CMTable from './components/CMTable'
import DQuickStats from './components/DQuickStats'
import DMessageView from './components/DMessageView'

const DContactMessagePage = () => {
  return (
    <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw] flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
      <ContactMessageHeader />
      <div className="w-full flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
        {/* User Contact messages Table */}
        <div className=" w-full">
          <CMTable />
        </div>
        <div className="grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] place-items-start">
          <DQuickStats />
          <DMessageView />
        </div>
      </div>
    </section>
  )
}

export default DContactMessagePage
