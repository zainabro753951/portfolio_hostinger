import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDeleteEntryContext } from '../../../../context/DeleteEntry'

const ProjectTable = () => {
  const { projects } = useSelector(state => state.projects)
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext()

  // ✅ Whenever something deletes successfully, call refetch()
  useEffect(() => {
    setQueryKey('projects') // used for DeleteConfirm context
  }, [setQueryKey])

  // const projects = [
  //   {
  //     title: 'E-Commerce UI',
  //     tags: 'ecommerce, ui',
  //     tech: 'React, Tailwind CSS',
  //     status: 'Published',
  //   },
  //   {
  //     title: 'Portfolio Website',
  //     tags: 'portfolio, personal',
  //     tech: 'Next.js, Framer Motion',
  //     status: 'Draft',
  //   },
  //   {
  //     title: 'Dashboard Redesign',
  //     tags: 'admin, ui',
  //     tech: 'React, GSAP, Tailwind',
  //     status: 'Published',
  //   },
  //   {
  //     title: 'Restaurant Landing Page',
  //     tags: 'restaurant, design',
  //     tech: 'HTML, CSS, JS',
  //     status: 'Published',
  //   },
  //   {
  //     title: 'Educational Website',
  //     tags: 'school, ui',
  //     tech: 'React, Tailwind CSS',
  //     status: 'Draft',
  //   },
  // ]

  return (
    <>
      <div
        className="w-full md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
      backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
      md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw] "
      >
        {/* ✅ Scrollable Wrapper for Mobile */}
        <div className="overflow-x-auto custom-scrollbar ">
          <div className="md:min-w-[100vw] sm:min-w-[150vw] xs:min-w-[250vw]">
            {' '}
            {/* 👈 Force width so scrollbar appears on small screens */}
            {/* Header */}
            <div className="w-full grid grid-cols-6 md:gap-[2vw] sm:gap-[4vw] xs:gap-[6vw] items-center md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] font-semibold text-cyan-300 border-b border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg">
              {['id', 'Title', 'Tags', 'Tech', 'Status', 'Action'].map((head, i) => (
                <div
                  key={i}
                  className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center tracking-wide uppercase"
                >
                  {head}
                </div>
              ))}
            </div>
            {/* Scrollable Table Body */}
            <div className="md:max-h-[25vw] sm:max-h-[55vw] xs:max-h-[75vw] overflow-y-auto custom-scrollbar divide-y divide-cyan-400/20 wrap-break-word">
              {projects.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-6 md:gap-[2vw] sm:gap-[4vw] xs:gap-[6vw] items-center text-cyan-100 md:text-[0.95vw] sm:text-[1.9vw] xs:text-[3.5vw]
                hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10
                transition-all duration-300 ease-in-out"
                  >
                    <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                      {item.id}
                    </div>
                    <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                      {item.title}
                    </div>
                    <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center text-cyan-200/90">
                      {item?.tag.map(item => {
                        return `${item.name},`
                      })}
                    </div>
                    <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center text-cyan-200/90">
                      {item?.techStack.map(item => {
                        return `${item.name}, `
                      })}
                    </div>
                    <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center">
                      <span
                        className={`md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[0.3vw] sm:py-[0.8vw] xs:py-[1.3vw] rounded-full text-[0.9em]
                    ${
                      item.status.toLowerCase() === 'published'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
                    }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] flex justify-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                      <Link
                        to={`/admin/add-project/${item.id}`}
                        className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7.5vw] xs:h-[7.5vw] md:rounded-[0.5vw] sm:rounded-[1vw] xs:rounded-[1.5vw] flex items-center justify-center
                    bg-gradient-to-r from-purple-600/30 to-indigo-600/30
                    border border-purple-500/40 text-purple-200 hover:from-purple-500/50 hover:to-indigo-500/40
                    shadow-[0_0_10px_rgba(147,51,234,0.3)] transition-all duration-300"
                      >
                        <FaEdit className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw]" />
                      </Link>

                      <button
                        onClick={() => {
                          setRoute(`/project/delete/${item?.id}`)
                          setIsOpen(true)
                          setQueryKey('projects')
                        }}
                        className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7.5vw] xs:h-[7.5vw] flex items-center justify-center md:rounded-[0.5vw] sm:rounded-[1vw] xs:rounded-[1.5vw]
                    bg-gradient-to-r from-cyan-600/30 to-blue-600/30
                    border border-cyan-500/40 text-cyan-200 hover:from-cyan-500/50 hover:to-blue-500/40
                    shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-300"
                      >
                        <FaTrashAlt className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw]" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectTable
