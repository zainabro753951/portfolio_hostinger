import React, { useEffect } from 'react'
import Header from '../../components/Header'
import HomeHero from './components/HomeHero'
import CustomCursor from '../../components/CustomCursor'
import About from './components/About'
import Skills from '../../components/Skills'
import Working from './components/Working'
import FeaturedRepos from '../../components/FeaturedRepos'
import PricingPlan from './components/PricingPlan'
import Testimonial from '../../components/Testimonial'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'
import Layout from '../../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { clearSeoPage, findSeoPageBySlug } from '../../features/siteSettingsSlice'
import { useLocation } from 'react-router-dom'
import PageTracker from '../../components/PageTracker'

const HomePage = () => {
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
        <HomeHero />
        <About />
        <Skills />
        <Working />
        <FeaturedRepos />
        <PricingPlan />
        <Testimonial />
        <Contact />
      </Layout>
    </>
  )
}

export default HomePage
