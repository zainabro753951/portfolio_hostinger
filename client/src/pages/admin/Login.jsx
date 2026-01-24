import React, { useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import { motion } from 'framer-motion' // fixed import name
import { useForm } from 'react-hook-form'
import FormField from './Components/FormField'
import { useSuperAdminLogin } from '../../Queries/login.js'
import { useEffect } from 'react'
import { glassToast } from './Components/ToastMessage.jsx'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { loginAdmin } from '../../features/authSlice.js'

const glassClass = `
  w-full bg-gradient-to-br from-[#0a0a2a]/70 to-[#101040]/40
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_30px_rgba(34,211,238,0.25)]
  md:p-[2vw] sm:p-[3vw] xs:p-[4vw]
  md:rounded-[1.5vw] sm:rounded-[2.5vw] xs:rounded-[3.5vw]
`

const fieldBase = `
  w-full bg-gradient-to-r from-white/5 to-white/10
  border border-cyan-400/20 focus:border-cyan-300/70
  md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]
  outline-none text-white placeholder:text-gray-400 backdrop-blur-xl
  md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
  transition-all duration-200 ease-in-out
  focus:shadow-[0_0_12px_rgba(34,211,238,0.25)]
  hover:border-cyan-400/40
  md:text-[1vw] sm:text-[2vw] xs:text-[3vw]
`

const Login = () => {
  const { mutate, isSuccess, isError, data, error } = useSuperAdminLogin()

  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isShow, setIsShow] = useState(false)
  const toggleShow = () => setIsShow(!isShow)

  const onSubmit = data => {
    mutate(data)
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(loginAdmin({ isAuth: true, ...data }))
      glassToast(data?.message, 'success')
    }

    if (isError) {
      glassToast(error?.response?.data?.message, 'error')
    }
  }, [isSuccess, isError])

  return (
    <div className="w-full h-screen font-inter bg-gradient-to-br from-[#0b1120] via-[#0f1e3a] to-[#111827] relative overflow-hidden text-white">
      {/* 🔵 Glass Blobs */}
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute -top-32 -left-32 w-[35vw] h-[35vw] bg-cyan-500/30 blur-[100px] rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
        className="absolute -bottom-32 -right-32 w-[35vw] h-[35vw] bg-indigo-500/30 blur-[100px] rounded-full"
      />

      <div className="w-full h-full flex items-center justify-center">
        <div
          className={`flex flex-col md:gap-[2vw] sm:gap-[2.5vw] xs:gap-[3vw] md:w-[35vw] sm:w-[65vw] xs:w-full ${glassClass}`}
        >
          {/* Header */}
          <div className="flex flex-col text-center">
            <h1 className="md:text-[1.8vw] sm:text-[2.8vw] xs:text-[4.3vw] font-semibold">
              Welcome Back
            </h1>
            <p className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[3.7vw] text-theme-text-gray">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]"
          >
            {/* Email Input */}
            <FormField
              label="Email"
              name="email"
              register={register}
              errors={errors}
              placeholder="Enter your email"
              required
            />

            {/* Password Input */}
            <div className="relative flex flex-col gap-0.5">
              <label className="flex flex-col">
                <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
                  Password
                </span>
                <div className="w-full relative">
                  <input
                    type={isShow ? 'text' : 'password'}
                    className={`${fieldBase}  md:pr-[3.5vw] sm:pr-[4.5vw] xs:pr-[6.5vw]`}
                    {...register('password', { required: 'Password is required' })}
                    placeholder="••••••••"
                  />
                  {/* Show/Hide Icon */}
                  <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {isShow ? <BiHide size={22} /> : <BiShow size={22} />}
                  </button>
                </div>
              </label>
              {errors.password && (
                <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="w-full flex items-center justify-between">
              <label className="flex items-center md:gap-[0.5vw] sm:gap-[1vw] xs:gap-[1.5vw] cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="accent-cyan-400 md:w-[1vw] md:h-[1vw] sm:w-[2vw] sm:h-[2vw] xs:w-[3.5vw] xs:h-[3.5vw]"
                />
                <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[3.6vw] text-theme-text-gray">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[3.6vw] text-cyan-400 underline hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 200 }}
              type="submit"
              className="w-full md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]"
            >
              Sign In
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
