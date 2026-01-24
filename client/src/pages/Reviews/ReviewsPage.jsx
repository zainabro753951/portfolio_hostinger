import React, { useEffect } from 'react'
import CustomCursor from '../../components/CustomCursor'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import Testimonial from '../../components/Testimonial'
import Footer from '../../components/Footer'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSeoPage, findSeoPageBySlug } from '../../features/siteSettingsSlice'
import Layout from '../../components/Layout'
import PageTracker from '../../components/PageTracker'

const ReviewsPage = () => {
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
          title="Client"
          gardient_title="Testimonials"
          desc="As a Full Stack Developer, I offer end-to-end solutions to build scalable, user-focused web applications using modern technologies like React, Node.js, AWS, and more."
        />
        <Testimonial />
      </Layout>
    </>
  )
}

export default ReviewsPage
