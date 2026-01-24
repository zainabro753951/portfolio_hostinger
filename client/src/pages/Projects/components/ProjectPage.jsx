import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { clearProject, projectFindById, projectFindBySlug } from '../../../features/projectSlice'
import Header from '../../../components/Header'
import ProjectHero from './ProjectHero'
import ProjectContent from './ProjectContent'
import Footer from '../../../components/Footer'
import NextProject from '../../../components/NextProject'
import Layout from '../../../components/Layout'

const ProjectPage = () => {
  const { projectSlug } = useParams()
  const { project, isLoading: projectLoading } = useSelector(state => state.projects)
  const [isLoading, setIsLoading] = useState(false)
  const [projectData, setProjectData] = useState({})
  const [projectContent, setProjectContent] = useState('')
  const dispatch = useDispatch()

  // Load project when projectSlug or id changes
  useEffect(() => {
    if (!projectSlug) {
      setIsLoading(false)
      dispatch(clearProject())
      return
    }

    setIsLoading(true)
    dispatch(projectFindBySlug(projectSlug))
    setIsLoading(false)
  }, [projectSlug, dispatch, projectLoading])

  // Update local state when project changes
  useEffect(() => {
    if (!project) {
      setProjectData({})
      setProjectContent('')
      return
    }

    const { content = '', ...rest } = project
    setProjectData(rest)
    setProjectContent(content)
  }, [project])
  console.log(projectData)

  return (
    <Layout
      title={projectData?.seoTitle}
      canonical={projectData?.canonicalUrl}
      description={projectData?.metaDesc}
      keywords={projectData?.metaKeywords?.join(',')}
      author={'Zain Ul Abbas'}
      noIndex={true}
      ogImage={projectData?.ogProjectImage?.url}
    >
      <ProjectHero isLoading={isLoading || projectLoading} projectData={projectData} />
      <ProjectContent isLoading={isLoading || projectLoading} projectContent={projectContent} />
      <NextProject />
    </Layout>
  )
}

export default ProjectPage
