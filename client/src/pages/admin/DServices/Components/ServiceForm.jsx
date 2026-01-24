import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAddServices } from '../../../../Queries/AddServices'
import { glassToast } from '../../Components/ToastMessage'
import FormField from '../../Components/FormField'
import FileInputField from '../../Components/FileInputField'
import SelectField from '../../Components/OptionField'
import TextareaField from '../../Components/TextAreaField'
import { ThreeCircles } from 'react-loader-spinner'
import { clearService, serviceFindById } from '../../../../features/serviceSlice'

const glassClass = `
  w-full bg-gradient-to-br from-[#0a0a2a]/70 to-[#101040]/40
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_30px_rgba(34,211,238,0.25)]
  md:p-[2vw] sm:p-[3vw] xs:p-[4vw]
  md:rounded-[1.5vw] sm:rounded-[2.5vw] xs:rounded-[3.5vw]
`

const fieldBase = `
  w-full bg-gradient-to-r from-white/5 to-white/10
  border border-cyan-400/20 focus:border-cyan-300/60
  md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw]
  outline-none text-white placeholder:text-gray-400
  backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw]
  md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
  transition-all duration-200 ease-in-out
  focus:ring-2 focus:ring-cyan-400/30 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]
  md:placeholder:text-[1vw] xs:placeholder:text-[2vw] xs:placeholder:text-[4vw] md:text-[1vw] sm:text-[2vw] xs:text-[3vw]
`

const ServiceForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { services, service } = useSelector(state => state.service)
  const [isUpdate, setIsUpdate] = useState(false)

  const defaultValues = {
    title: '',
    shortDesc: '',
    status: 'Draft',
    category: '',
    serviceImage: null,
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  useEffect(() => {
    if (id && services?.length > 0) {
      dispatch(serviceFindById(Number(id)))
    } else {
      dispatch(clearService())
      reset(defaultValues)
    }
  }, [id, services, reset])

  // Education Form Fields update
  useEffect(() => {
    if (id && service && service?.id === Number(id)) {
      reset({
        title: service?.title,
        shortDesc: service?.shortDesc,
        status: service?.status || 'Draft',
        category: service?.category,
      })
      setIsUpdate(true)
    } else {
      // ✅ When id becomes null (create mode)
      setIsUpdate(false)
      reset(defaultValues)
    }
  }, [id, service, reset])
  console.log(isUpdate)

  const { mutate, isPending, isError, isSuccess, data, error } = useAddServices()
  const onSubmit = data => {
    console.log(data)

    const formData = new FormData()
    formData.append('isUpdate', isUpdate)
    formData.append('serviceId', isUpdate ? id : null)
    formData.append(
      'serviceImageOBJ',
      isUpdate && service?.serviceImage ? JSON.stringify(service?.serviceImage) : ''
    )

    // ✅ Correct file handling
    if (data.serviceImage && data.serviceImage[0]) {
      formData.append('serviceImage', data.serviceImage[0]) // only append the file itself
    }

    // Append all other fields (except the file)
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'serviceImage' && value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })

    for (data of formData) {
      console.log(data)
    }

    mutate(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      console.log(data)
      glassToast(data?.message, 'success')
    }
    if (isError) {
      console.log(error?.response?.data)
      glassToast(error?.response?.data?.message, 'error')
    }
  }, [isSuccess, isError])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={glassClass}
    >
      <h3 className="text-white font-semibold md:text-[1.6vw] sm:text-[2.6vw] xs:text-[4.6vw] tracking-wide mb-[1vw]">
        🎓 Add Experience
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="w-full flex flex-col md:gap-[1.2vw] sm:gap-[2.2vw] xs:gap-[3.2vw]"
      >
        {/* Row 1 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw]">
          <FormField
            label="Service Title"
            name="title"
            register={register}
            errors={errors}
            placeholder="e.g., Modern Frontend Website Development"
          />
          <SelectField
            label="Status"
            name={`status`}
            register={register}
            errors={errors}
            required={false}
            placeholder="-- Select Service Status --"
            options={[
              { value: 'Published', label: 'Published' },
              { value: 'Draft', label: 'Draft' },
            ]}
          />
        </div>

        <div className="w-full grid md:grid-cols-2 xs:grid-cols-1 gap-[1vw] items-center">
          <SelectField
            label="Category"
            name={`category`}
            register={register}
            errors={errors}
            required={false}
            placeholder="-- Select Service Category --"
            options={[
              { value: 'Frontend Development', label: 'Frontend Development' },
              { value: 'Backend Development', label: 'Backend Development' },
              { value: 'Full Stack Development', label: 'Full Stack Development' },
              { value: 'Web Design', label: 'Web Design' },
              { value: 'UI/UX Design', label: 'UI/UX Design' },
              { value: 'Landing Page Development', label: 'Landing Page Development' },
              { value: 'E-commerce Development', label: 'E-commerce Development' },
              { value: 'Portfolio Websites', label: 'Portfolio Websites' },
              { value: 'Business Websites', label: 'Business Websites' },
              { value: 'Blog Websites', label: 'Blog Websites' },
              { value: 'CMS Development', label: 'CMS Development' },
              { value: 'WordPress Development', label: 'WordPress Development' },
              { value: 'React.js Development', label: 'React.js Development' },
              { value: 'Next.js Development', label: 'Next.js Development' },
              { value: 'Node.js Development', label: 'Node.js Development' },
              { value: 'Express.js Development', label: 'Express.js Development' },
              { value: 'API Integration', label: 'API Integration' },
              { value: 'Website Maintenance', label: 'Website Maintenance' },
              { value: 'Website Optimization', label: 'Website Optimization' },
              { value: 'SEO Optimization', label: 'SEO Optimization' },
              { value: 'Hosting & Deployment', label: 'Hosting & Deployment' },
              { value: 'Website Security', label: 'Website Security' },
              { value: 'Custom Web Application', label: 'Custom Web Application' },
              { value: 'Responsive Design', label: 'Responsive Design' },
              { value: 'Performance Optimization', label: 'Performance Optimization' },
            ]}
          />
          <FileInputField
            label="Services Image"
            name="serviceImage"
            register={register}
            error={errors['serviceImage']}
            existingFileUrl={service?.serviceImage?.url || ''}
            required={false}
            fieldBase={fieldBase}
          />
        </div>

        <TextareaField
          label="Service Description"
          name={`shortDesc`}
          register={register}
          errors={errors}
          placeholder="Describe Services..."
        />

        {/* Submit Button */}
        <div className="w-full flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
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
              'Add Services'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default ServiceForm
