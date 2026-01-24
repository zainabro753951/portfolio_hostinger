import React, { useEffect } from 'react'
import CustomCursor from '../../components/CustomCursor'
import Header from '../../components/Header'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSeoPage, findSeoPageBySlug } from '../../features/siteSettingsSlice'
import Layout from '../../components/Layout'
import PageTracker from '../../components/PageTracker'

const ContactPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { seo_pages, seo_page } = useSelector(state => state.siteSettings)

  // Load SEO Page for home
  useEffect(() => {
    if (seo_pages.length > 0) {
      // Normalize path
      let basePath = location.pathname

      // Example: if pathname starts with /contact/ and has an ID, normalize to /contact
      if (basePath.startsWith('/contact/')) {
        basePath = '/contact'
      }

      dispatch(findSeoPageBySlug(basePath))
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
        <Contact />
      </Layout>
    </>
  )
}

export default ContactPage
