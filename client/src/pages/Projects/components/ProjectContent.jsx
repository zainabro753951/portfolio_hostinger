import React from 'react'
import '../../../tiptap.css'

const ProjectContent = ({ projectContent }) => {
  return (
    <div className="w-full bg-theme-dark min-h-screen md:py-[4vw] sm:py-[6vw] xs:py-[8vw]">
      {/* Output Preview */}
      <div className="md:p-[0.9vw] sm:p-[1.4vw] xs:p-[1.9vw] mx-auto text-white md:w-[65%]">
        <div className="rich-output" dangerouslySetInnerHTML={{ __html: projectContent }} />
      </div>
    </div>
  )
}

export default ProjectContent
