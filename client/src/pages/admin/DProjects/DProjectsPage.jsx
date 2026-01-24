import ProjectSortBar from './components/ProjectSortBar'
import ProjectStatsCards from './components/ProjectStatsCard'
import ProjectTable from './components/ProjectTable'
import ProjectPagination from './components/ProjectPagination'

const DProjectsPage = () => {
  return (
    <>
      <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw]">
        <ProjectSortBar />
        <ProjectStatsCards />
        <ProjectTable />
        <ProjectPagination />
      </section>
    </>
  )
}

export default DProjectsPage
