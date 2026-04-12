import React, { useState, useCallback, memo } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { useSuperAdminLogin } from "../../Queries/login.js";
import { useEffect } from "react";
import { glassToast } from "./Components/ToastMessage.jsx";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../features/authSlice.js";

// ==========================================
// OPTIMIZED ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

const blobVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 0.6,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

// ==========================================
// FIXED STYLES - Gradient Issue Resolved
// ==========================================
const styles = {
  // Main Container - Glass Card
  glassCard: `
    w-full 
    bg-[#0a0a2a]/70 
    backdrop-blur-2xl
    border border-white/20 
    shadow-[0_8px_32px_rgba(34,211,238,0.15)]
    lg:p-8 md:p-6 sm:p-5 p-4
    lg:rounded-3xl md:rounded-2xl sm:rounded-xl rounded-xl
    max-w-[480px] md:max-w-[440px] sm:max-w-[400px]
    will-change-transform
    relative
    overflow-hidden
  `,

  // FIXED: Input Field with Solid Background instead of Gradient
  // Issue: bg-gradient-to-r from-white/5 to-white/10 was rendering as white
  // Solution: Use solid semi-transparent background or CSS custom properties
  inputField: `
    w-full 
    bg-[rgba(255,255,255,0.08)]
    hover:bg-[rgba(255,255,255,0.12)]
    focus:bg-[rgba(255,255,255,0.15)]
    border border-cyan-400/30 
    focus:border-cyan-300/80
    lg:rounded-xl md:rounded-lg sm:rounded-lg rounded-lg
    outline-none text-white placeholder:text-gray-400/70 
    backdrop-blur-md
    lg:px-4 md:px-4 sm:px-3 px-3 
    lg:py-3.5 md:py-3 sm:py-2.5 py-3
    lg:text-base md:text-[15px] sm:text-[14px] text-[15px]
    transition-all duration-300 ease-out
    focus:shadow-[0_0_20px_rgba(34,211,238,0.3)]
    hover:border-cyan-400/50
    will-change-auto
  `,

  // Alternative: If you want gradient, use this version with proper fallback
  inputFieldGradient: `
    w-full 
    bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.12)]
    border border-cyan-400/30 
    focus:border-cyan-300/80
    lg:rounded-xl md:rounded-lg sm:rounded-lg rounded-lg
    outline-none text-white placeholder:text-gray-400/70 
    backdrop-blur-md
    lg:px-4 md:px-4 sm:px-3 px-3 
    lg:py-3.5 md:py-3 sm:py-2.5 py-3
    lg:text-base md:text-[15px] sm:text-[14px] text-[15px]
    transition-all duration-300 ease-out
    focus:shadow-[0_0_20px_rgba(34,211,238,0.3)]
    focus:from-[rgba(255,255,255,0.08)] focus:to-[rgba(255,255,255,0.15)]
    hover:border-cyan-400/50
    will-change-auto
  `,

  // Submit Button
  submitButton: `
    w-full 
    lg:py-3.5 md:py-3 sm:py-2.5 py-3
    bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500
    text-white font-semibold
    border border-cyan-400/50 
    shadow-[0_4px_20px_rgba(34,211,238,0.3)]
    lg:rounded-xl md:rounded-lg sm:rounded-lg rounded-lg
    lg:text-lg md:text-base sm:text-[15px] text-base
    tracking-wide
    relative overflow-hidden
    group
    will-change-transform
  `,

  // Typography
  heading: `
    lg:text-[32px] md:text-[28px] sm:text-[24px] text-[24px]
    font-bold bg-gradient-to-r from-white to-cyan-200 
    bg-clip-text text-transparent
    tracking-tight
  `,

  subheading: `
    lg:text-base md:text-[15px] sm:text-[14px] text-[14px]
    text-gray-400/90
    mt-2
  `,

  labelText: `
    lg:text-sm md:text-[13px] sm:text-[12px] text-[13px]
    text-gray-300 font-medium
    mb-1.5
    block
  `,

  errorText: `
    lg:text-[13px] md:text-[12px] sm:text-[11px] text-[12px]
    text-red-400 mt-1.5
    font-medium
  `,

  linkText: `
    lg:text-sm md:text-[13px] sm:text-[12px] text-[13px]
    text-cyan-400 hover:text-cyan-300 
    transition-colors duration-200
    font-medium
  `,

  checkbox: `
    accent-cyan-400 
    lg:w-4 lg:h-4 md:w-4 md:h-4 sm:w-3.5 sm:h-3.5 w-4 h-4
    cursor-pointer
  `,
};

// ==========================================
// MEMOIZED FORM FIELD COMPONENT
// ==========================================
const FormField = memo(
  ({
    label,
    name,
    register,
    errors,
    placeholder,
    required,
    type = "text",
    icon: Icon,
  }) => {
    return (
      <motion.div
        className="relative flex flex-col gap-0.5"
        variants={itemVariants}
      >
        <label className="flex flex-col">
          <span className={styles.labelText}>{label}</span>
          <div className="w-full relative group">
            <input
              type={type}
              className={`${styles.inputField} ${Icon ? "lg:pl-11 md:pl-10 sm:pl-9 pl-10" : ""}`}
              {...register(name, {
                required: required ? `${label} is required` : false,
              })}
              placeholder={placeholder}
              aria-invalid={errors[name] ? "true" : "false"}
            />
            {Icon && (
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-200">
                <Icon size={20} />
              </div>
            )}
          </div>
        </label>
        <AnimatePresence mode="wait">
          {errors[name] && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={styles.errorText}
            >
              {errors[name].message}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

FormField.displayName = "FormField";

// ==========================================
// MEMOIZED PASSWORD FIELD COMPONENT
// ==========================================
const PasswordField = memo(({ register, errors, isShow, toggleShow }) => {
  return (
    <motion.div
      className="relative flex flex-col gap-0.5"
      variants={itemVariants}
    >
      <label className="flex flex-col">
        <span className={styles.labelText}>Password</span>
        <div className="w-full relative group">
          <input
            type={isShow ? "text" : "password"}
            className={`${styles.inputField} lg:pr-12 md:pr-11 sm:pr-10 pr-11`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="••••••••"
            aria-invalid={errors.password ? "true" : "false"}
          />
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-cyan-400 
                       transition-all duration-200
                       p-1 rounded-md hover:bg-white/5
                       focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label={isShow ? "Hide password" : "Show password"}
          >
            <motion.div
              initial={false}
              animate={{ scale: 1, rotate: isShow ? 0 : 0 }}
              whileTap={{ scale: 0.9 }}
            >
              {isShow ? <BiHide size={20} /> : <BiShow size={20} />}
            </motion.div>
          </button>
        </div>
      </label>
      <AnimatePresence mode="wait">
        {errors.password && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.errorText}
          >
            {errors.password.message}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

PasswordField.displayName = "PasswordField";

// ==========================================
// MAIN LOGIN COMPONENT
// ==========================================
const Login = () => {
  const { mutate, isSuccess, isError, data, error, isPending } =
    useSuperAdminLogin();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [isShow, setIsShow] = useState(false);

  const toggleShow = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    (formData) => {
      mutate(formData);
    },
    [mutate],
  );

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(loginAdmin({ isAuth: true, ...data }));
      glassToast(data?.message || "Login successful!", "success");
      reset();
    }

    if (isError && error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      glassToast(errorMessage, "error");
    }
  }, [isSuccess, isError, data, error, dispatch, reset]);

  return (
    <div className="min-h-screen w-full font-sans bg-[#0b1120] relative overflow-hidden text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Background Gradient Base */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0b1120] via-[#0f1e3a] to-[#111827] -z-20" />

      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 opacity-30 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Animated Glass Blobs */}
      <motion.div
        variants={blobVariants}
        initial="initial"
        animate="animate"
        className="fixed -top-40 -left-40 lg:w-[600px] lg:h-[600px] md:w-[500px] md:h-[500px] sm:w-[400px] sm:h-[400px] w-[300px] h-[300px] 
                   bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none will-change-transform"
        style={{ translateZ: 0 }}
      />
      <motion.div
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
        className="fixed -bottom-40 -right-40 lg:w-[600px] lg:h-[600px] md:w-[500px] md:h-[500px] sm:w-[400px] sm:h-[400px] w-[300px] h-[300px] 
                   bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none will-change-transform"
        style={{ translateZ: 0 }}
      />

      {/* Additional decorative blob */}
      <motion.div
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   lg:w-[800px] lg:h-[800px] md:w-[600px] md:h-[600px] w-[400px] h-[400px]
                   bg-blue-500/10 blur-[150px] rounded-full pointer-events-none will-change-transform"
        style={{ translateZ: 0 }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.glassCard}
        >
          {/* Header Section */}
          <motion.div
            className="flex flex-col text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 
                         border border-cyan-400/30 flex items-center justify-center
                         shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <svg
                className="w-8 h-8 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>

            <h1 className={styles.heading}>Welcome Back</h1>
            <p className={styles.subheading}>
              Sign in to your Super Admin account
            </p>
          </motion.div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-5"
            noValidate
          >
            {/* Email Field */}
            <FormField
              label="Email Address"
              name="email"
              type="email"
              register={register}
              errors={errors}
              placeholder="admin@example.com"
              required
            />

            {/* Password Field */}
            <PasswordField
              register={register}
              errors={errors}
              isShow={isShow}
              toggleShow={toggleShow}
            />

            {/* Remember Me + Forgot Password */}
            <motion.div
              className="w-full flex items-center justify-between pt-1"
              variants={itemVariants}
            >
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className={styles.checkbox}
                />
                <span className="lg:text-sm md:text-[13px] sm:text-[12px] text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className={styles.linkText}
                onClick={(e) => {
                  e.preventDefault();
                  glassToast("Password reset feature coming soon!", "info");
                }}
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={isPending || isSubmitting}
                className={`${styles.submitButton} ${isPending || isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending || isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg
                        className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-white/10 text-center"
          >
            <p className="lg:text-sm md:text-[13px] sm:text-[12px] text-[12px] text-gray-500">
              Protected by reCAPTCHA and subject to the{" "}
              <a
                href="#"
                className="text-cyan-400/80 hover:text-cyan-400 transition-colors"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-cyan-400/80 hover:text-cyan-400 transition-colors"
              >
                Terms of Service
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Reduced Motion Support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(Login);
