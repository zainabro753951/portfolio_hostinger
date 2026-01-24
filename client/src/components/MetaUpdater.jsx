import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const MetaUpdater = () => {
  const { site_info, seo_pages, isLoading } = useSelector(state => state.siteSettings)
  const location = useLocation()

  useEffect(() => {
    if (isLoading || !site_info || !seo_pages) return

    // Normalize pathname
    const currentPath = location.pathname.replace(/\/+$/, '') || '/'
    const currentSEO = seo_pages.find(page => page.pageSlug === currentPath)

    // --- Meta Data ---
    const metaTitle = currentSEO?.metaTitle || `${site_info.websiteName} | ${site_info.tagline}`
    const metaDescription = currentSEO?.metaDescription || site_info.tagline || ''
    const metaKeywords = currentSEO?.metaKeyword || ''
    const ogImage = site_info.logoImage?.url || site_info.favicon?.url || ''
    const canonical = `${window.location.origin}${currentPath}`

    // --- Document Title ---
    document.title = metaTitle

    // --- Meta Tags ---
    updateMetaTag('name', 'description', metaDescription)
    updateMetaTag('name', 'keywords', metaKeywords)
    updateMetaTag('property', 'og:title', metaTitle)
    updateMetaTag('property', 'og:description', metaDescription)
    updateMetaTag('property', 'og:image', ogImage)
    updateMetaTag('property', 'og:url', canonical)
    updateMetaTag('property', 'og:type', 'website')
    updateMetaTag('name', 'twitter:title', metaTitle)
    updateMetaTag('name', 'twitter:description', metaDescription)
    updateMetaTag('name', 'twitter:image', ogImage)

    // --- Favicon & Canonical ---
    updateFavicon(site_info.favicon?.url)
    updateLinkTag('canonical', canonical)

    // --- Google Analytics ---

    if (site_info.googleAnalytics) {
      injectGoogleAnalytics(site_info.googleAnalytics)
    }
  }, [site_info, seo_pages, location.pathname, isLoading])

  // --- Helper Functions ---
  const updateMetaTag = (attr, name, content) => {
    if (!content) return
    let tag = document.querySelector(`meta[${attr}="${name}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute(attr, name)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  }

  const updateLinkTag = (rel, href) => {
    if (!href) return
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', rel)
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
  }

  const updateFavicon = href => {
    if (!href) return
    let favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.setAttribute('rel', 'icon')
      document.head.appendChild(favicon)
    }
    favicon.setAttribute('href', href)
  }

  const injectGoogleAnalytics = code => {
    if (!code) return
    if (document.getElementById('google-analytics-script')) return // prevent duplicates

    // --- Extract Measurement ID if code is only ID ---
    let measurementId = null
    const idMatch = code.match(/G-[A-Z0-9]+/)
    if (idMatch) measurementId = idMatch[0]

    if (measurementId) {
      // Create GA script dynamically
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)

      script.onload = () => {
        window.dataLayer = window.dataLayer || []
        function gtag() {
          window.dataLayer.push(arguments)
        }
        window.gtag = gtag
        gtag('js', new Date())
        gtag('config', measurementId)
        console.log('✅ Google Analytics initialized:', measurementId)
      }
    } else {
      // fallback: inject full script as innerHTML (if it contains <script> tags)
      const temp = document.createElement('div')
      temp.innerHTML = code
      const scripts = temp.querySelectorAll('script')
      scripts.forEach(s => {
        const newScript = document.createElement('script')
        if (s.src) newScript.src = s.src
        else newScript.innerHTML = s.innerHTML
        newScript.async = true
        document.head.appendChild(newScript)
      })
    }
  }

  return null
}

export default MetaUpdater
