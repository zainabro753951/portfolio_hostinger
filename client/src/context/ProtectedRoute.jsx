import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useSelector(state => state.adminAuth)

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
