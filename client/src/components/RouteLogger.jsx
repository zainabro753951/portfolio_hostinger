import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RouteLogger = () => {
  const location = useLocation()
  useEffect(() => {
    console.log('📍 Navigated to:', location.pathname)
  }, [location])
  return null
}

export default RouteLogger
