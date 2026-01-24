import React from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from './Footer'
import Header from './Header'

const Layout = ({
  children,
  title,
  ogTitle,
  description,
  keywords,
  author,
  canonical,
  metaRobots,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
}) => {
  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>{title || 'Default Title'}</title>
        <meta name="description" content={description || 'Default description'} />
        {keywords && <meta name="keywords" content={keywords} />}
        {author && <meta name="author" content={author} />}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}

        {/* Index / Noindex */}
        <meta name="robots" content={metaRobots} />

        {/* Open Graph / Social Meta */}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={ogTitle?.length === 0 ? title : ogTitle} />
        <meta property="og:description" content={description} />
        {ogImage && <meta property="og:image" content={ogImage} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Helmet>

      <div className="layout-container">
        <Header />
        <main>{children}</main>
        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

export default Layout
