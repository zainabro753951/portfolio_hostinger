import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'motion/react'
import FormField from '../../Components/FormField'
import { useAddAbout } from '../../../../Queries/AddAbout'
import { glassToast } from '../../Components/ToastMessage'
import { ThreeCircles } from 'react-loader-spinner'
import TextareaField from '../../Components/TextAreaField'
import { useSelector } from 'react-redux'
import { useState } from 'react'

// const fieldBase =
//   'w-full bg-gradient-to-r from-white/6 to-white/3 border border-cyan-400/20 focus:border-cyan-300/70 md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] outline-none text-white placeholder:text-gray-400 backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] transition-shadow duration-200 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[3.1vw] focus:ring-theme-cyan/30 focus:ring-3'

const AboutForm = () => {
  const { data: about } = useSelector(state => state.about)
  const [aboutPreview, setAboutPreview] = useState(null)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isAboutImageRemoved, setIsAboutImageRemoved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      shortRole: '',
      shortDesc: '',
      longDesc: '',
      aboutImage: null,
    },
  })

  const aboutImage = watch('aboutImage')
  const SHORT_DESC_LIMIT = 200

  // 🧠 Prefill when data comes from Redux
  useEffect(() => {
    if (about && Object.keys(about).length > 0) {
      reset({
        fullName: about?.fullName || '',
        shortRole: about?.shortRole || '',
        shortDesc: about?.shortDesc || '',
        longDesc: about?.longDesc || '',
      })

      setAboutPreview(about?.aboutImage?.url || null)
      setIsUpdate(true)
    }
  }, [about, reset])

  useEffect(() => {
    if (aboutImage && aboutImage?.[0]) {
      setAboutPreview(URL.createObjectURL(aboutImage[0]))
    }
  }, [aboutImage])

  const { mutate, isPending, isError, isSuccess, data, error } = useAddAbout()

  // ✅ Safe Form Submit
  const onSubmit = formData => {
    const fd = new FormData()

    fd.append('isUpdate', isUpdate ? 'true' : 'false')
    fd.append('fullName', formData.fullName)
    fd.append('shortRole', formData.shortRole)
    fd.append('shortDesc', formData.shortDesc)
    fd.append('longDesc', formData.longDesc)
    fd.append('isAboutImageRemoved', JSON.stringify(isAboutImageRemoved))

    // 🖼 Handle image safely
    if (formData.aboutImage && formData.aboutImage[0]) {
      fd.append('aboutImage', formData.aboutImage[0])
    }

    // 🧩 Safe stringify existing image object (if any)
    fd.append('aboutImageOBJ', about?.aboutImage ? JSON.stringify(about.aboutImage) : 'null')

    mutate(fd)
  }

  // 🧃 Toast Feedback
  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message, 'success')
    }
    if (isError) {
      glassToast(error?.response?.data?.message || 'Something went wrong', 'error')
    }
  }, [isSuccess, isError])
  console.log(aboutPreview)

  const fadeIn = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45 } },
  }
  return (
    <div>
      <h3 className="md:text-[1.4vw] sm:text-[2.4vw] xs:text-[4.4vw] font-semibold">
        About / Profile
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="grid md:grid-cols-3 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw]"
      >
        {/* About Image */}
        <div className="w-full flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{
              duration: 0.9,
              ease: 'anticipate',
            }}
            className="flex flex-col items-center md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] md:p-[2.5vw] sm:p-[3vw] xs:p-[3.5vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full "
          >
            <div className="md:w-[15vw] md:h-[15vw] sm:w-[30vw] sm:h-[30vw] xs:w-[45vw] xs:h-[45vw] rounded-full border-2 border-theme-cyan overflow-hidden flex items-center justify-center md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-400">
              {aboutPreview ? (
                <img src={aboutPreview} className="w-full h-full object-cover" alt="" />
              ) : (
                <p className="md:w-[80%] text-center">No Profile Image Uploaded</p>
              )}
            </div>
            <div className="flex items-center md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
              <div>
                <label
                  type="button"
                  htmlFor="aboutImage"
                  className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-cyan-500 text-black font-semibold hover:brightness-110 transition md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
                >
                  Upload
                </label>
                <input
                  type="file"
                  id="aboutImage"
                  name="aboutImage"
                  accept="image/*"
                  onClick={() => setIsAboutImageRemoved(false)}
                  {...register('aboutImage')}
                  hidden
                />
                {/* Validation Error */}
                {errors.aboutImage && (
                  <p className="text-red-400 md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.6vw] mt-[0.6vw]">
                    {errors.aboutImage.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setValue('aboutImage', null)
                  setAboutPreview(null)
                  setIsAboutImageRemoved(true)
                }}
                type="button"
                className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8 transition md:text-[1vw] sm:text-[2vw] xs:text-[4vw]"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
        {/* About Details */}
        <div className="md:col-span-2 w-full flex flex-col">
          {/* About Form */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{
              delay: '0.9',
              duration: 0.9,
              ease: 'anticipate',
            }}
            className="md:p-[2.5vw] sm:p-[3vw] xs:p-[3.5vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full  flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              <FormField
                label={'Full Name'}
                name={'fullName'}
                register={register}
                errors={errors}
                placeholder="Full name"
              />

              <FormField
                label={'Short Title'}
                name={'shortRole'}
                register={register}
                errors={errors}
                placeholder="Short title / role"
              />
            </div>

            <TextareaField
              label="Short Description"
              name={`shortDesc`}
              register={register}
              errors={errors}
              placeholder="Describe your coursework, achievements, or focus areas..."
            />

            <TextareaField
              label="Long Description"
              name={`longDesc`}
              register={register}
              errors={errors}
              rows={10}
              placeholder="Describe your coursework, achievements, or focus areas..."
            />

            <div className="w-full flex flex-col">
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200 }}
                whileTap={{ scale: 0.98 }}
                className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] flex items-center justify-center"
                title={isPending ? 'Loading...' : ''}
                type={isPending ? 'button' : 'submit'}
              >
                {isPending ? (
                  <ThreeCircles
                    visible={true}
                    color="#ff657c"
                    width={20}
                    height={20}
                    ariaLabel="three-circles-loading"
                  />
                ) : (
                  'Save'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  )
}

export default AboutForm
