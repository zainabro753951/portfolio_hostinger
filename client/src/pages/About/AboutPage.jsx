import React, { useEffect } from 'react'
import CustomCursor from '../../components/CustomCursor'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Skills from '../../components/Skills'
import Experience from './components/Experience'
import Layout from '../../components/Layout'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSeoPage, findSeoPageBySlug } from '../../features/siteSettingsSlice'
import PageTracker from '../../components/PageTracker'

const AboutPage = () => {
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
        <Skills />
        <Experience />
      </Layout>
    </>
  )
}

export default AboutPage
