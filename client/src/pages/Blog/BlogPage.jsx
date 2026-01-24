import React from 'react'
import CustomCursor from '../../components/CustomCursor'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import Footer from '../../components/Footer'

const BlogPage = () => {
  return (
    <>
      <CustomCursor />
      <Header />
      <HeroSection
        title="Blog"
        title2={Resources}
        gardient_title="&"
        desc="Explore guides, case studies, and resources designed to help developers, startups, and businesses leverage technology effectively."
      />
      <Footer />
    </>
  )
}

export default BlogPage
