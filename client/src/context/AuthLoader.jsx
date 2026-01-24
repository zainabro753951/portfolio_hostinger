import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { checkAuth } from '../Queries/SecureRoute'
import { loginAdmin, logoutAdmin } from '../features/authSlice'
import ThemeReloader from '../components/ThemeReloader'

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch()
  const { data, isError, isSuccess, isLoading, isFetching } = checkAuth()

  const isVerifying = isLoading || isFetching

  useEffect(() => {
    if (isError) {
      dispatch(logoutAdmin())
    } else if (isSuccess && data?.admin) {
      dispatch(loginAdmin({ isAuth: true, ...data.admin }))
    }
  }, [isError, isSuccess, data, dispatch])

  // 🚫 Don't render routes until verification is done
  if (isVerifying) {
    return <ThemeReloader />
  }

  return children
}

export default AuthLoader
