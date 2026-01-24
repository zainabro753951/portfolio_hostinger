import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageVisit } from '../Utils/usePageVisit'

const PageTracker = () => {
  const location = useLocation()
  const pageVisit = usePageVisit()

  useEffect(() => {
    pageVisit(location.pathname)
  }, [location.pathname])

  return null
}

export default PageTracker
