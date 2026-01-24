import React from 'react'
import CustomCursor from '../../components/CustomCursor'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import FeaturedRepos from '../../components/FeaturedRepos'
import Footer from '../../components/Footer'
import Layout from '../../components/Layout'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { clearSeoPage, findSeoPageBySlug } from '../../features/siteSettingsSlice'
import PageTracker from '../../components/PageTracker'

const ProjectsPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { seo_pages, seo_page } = useSelector(state => state.siteSettings)

  // Load SEO Page for home
  useEffect(() => {
    if (seo_pages.length > 0) {
      dispatch(findSeoPageBySlug(location.pathname))
    } else {
      dispatch(clearSeoPage())
    }
  }, [seo_pages, location.pathname, dispatch])
  return (
    <>
      <Layout
        title={seo_page?.metaTitle}
        ogTitle={seo_page?.OGTitle}
        canonical={seo_page?.canonicalURL}
        description={seo_page?.metaDescription}
        keywords={seo_page?.metaKeyword}
        author={'Zain Ul Abbas'}
        metaRobots={seo_page?.metaRobots}
        twitterCard={seo_page?.twitterCardType}
      >
        <PageTracker />
        <CustomCursor />
        <HeroSection
          title="Featured"
          gardient_title="Projects"
          desc="Explore my portfolio of web applications, open-source contributions, and experimental builds that reflect my passion for creating impactful digital solutions."
        />
        <FeaturedRepos />
      </Layout>
    </>
  )
}

export default ProjectsPage
