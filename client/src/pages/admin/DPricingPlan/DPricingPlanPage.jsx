import React from 'react'
import { motion } from 'motion/react'
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header'
import DPricingPlanTable from './components/DPricingPlanTable'
import DPricingPlanForm from './components/DPricingPlanForm'

const DPricingPlanPage = () => {
  return (
    <>
      <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw] flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
        {/* Pricing Plan Table */}
        <DPricingPlanTable />
        {/* Pricing Plan Form */}
        <DPricingPlanForm />
      </section>
    </>
  )
}

export default DPricingPlanPage
