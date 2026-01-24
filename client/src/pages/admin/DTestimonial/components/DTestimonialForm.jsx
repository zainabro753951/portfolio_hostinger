import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormField from '../../Components/FormField'
import { useAddTestimonial } from '../../../../Queries/AddTestimonial'
import { ThreeCircles } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { glassToast } from '../../Components/ToastMessage'
import { useParams } from 'react-router-dom'
import { clearTestimonial, testiFindById } from '../../../../features/testimonialSlice'
import FileInputField from '../../Components/FileInputField'
const glassClass = `
  w-full bg-gradient-to-br from-[#0a0a2a]/70 to-[#101040]/40
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_30px_rgba(34,211,238,0.25)]
  md:p-[2vw] sm:p-[3vw] xs:p-[4vw]
  md:rounded-[1.5vw] sm:rounded-[2.5vw] xs:rounded-[3.5vw]
`

const fieldBase = ` w-full bg-gradient-to-r from-white/5 to-white/10
  border border-cyan-400/20 focus:border-cyan-300/60
  md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw]
  outline-none text-white placeholder:text-gray-400
  backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw]
  md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
  transition-all duration-200 ease-in-out
  focus:ring-2 focus:ring-cyan-400/30 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]
  md:placeholder:text-[1vw] xs:placeholder:text-[2vw] xs:placeholder:text-[4vw]
  md:text-[1vw] sm:text-[2vw] xs:text-[4vw]
`
const DTestimonialForm = () => {
  const { projects } = useSelector(state => state.projects)
  const { testimonials, testimonial } = useSelector(state => state.testimonial)
  const [isUpdate, setIsUpdate] = useState(false)
  const { id } = useParams()
  const dispatch = useDispatch()

  const defaultValues = {
    clientName: '',
    designationRole: '',
    company: '',
    clientImage: '',
    ratting: '',
    projectId: '',
    testimonialDate: '',
    message: '',
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
    if (id && testimonials.length > 0) {
      dispatch(testiFindById(Number(id)))
    } else {
      dispatch(clearTestimonial())
      reset(defaultValues)
    }
  }, [id, reset, testimonials])

  // Testimonials Form Fields update
  useEffect(() => {
    if (id && testimonial && testimonial?.id === Number(id)) {
      const formattedDate = testimonial.testimonialDate
        ? testimonial.testimonialDate.split('T')[0]
        : ''
      reset({
        clientName: testimonial?.clientName || '',
        designationRole: testimonial?.designationRole || '',
        company: testimonial?.company || '',
        clientImage: testimonial?.clientImage || '',
        ratting: testimonial?.ratting ? parseFloat(testimonial?.ratting).toString() : '',
        projectTitle: testimonial?.projectId.toString() || '',
        testimonialDate: formattedDate,
        message: testimonial?.message || '',
      })
      setIsUpdate(true)
    }
  }, [id, testimonial, reset])

  console.log(testimonial)

  const { mutate, isPending, isError, isSuccess, data, error } = useAddTestimonial()
  const onSubmit = data => {
    const formData = new FormData()
    formData.append('isUpdate', isUpdate)
    formData.append('testimonialID', isUpdate && id)
    formData.append(
      'clientImageOBJ',
      isUpdate && testimonial?.clientImage ? JSON.stringify(testimonial?.clientImage) : ''
    )
    formData.append('clientName', data.clientName)
    formData.append('designationRole', data.designationRole)
    formData.append('company', data.company)
    formData.append('clientImage', data.clientImage[0])
    formData.append('ratting', data.ratting)
    formData.append('projectId', data.projectTitle)
    formData.append('testimonialDate', data.testimonialDate)
    formData.append('message', data.message)
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={glassClass}
      >
        <h3 className="text-white font-semibold md:text-[1.6vw] sm:text-[2.6vw] xs:text-[4.6vw] tracking-wide mb-[1vw]">
          Add Testimonial
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          enctype="multipart/form-data"
          className="w-full flex flex-col md:gap-[1.2vw] sm:gap-[2.2vw] xs:gap-[3.2vw]"
        >
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
            <FormField
              label="Name"
              name="clientName"
              register={register}
              errors={errors}
              placeholder="e.g., “John Doe”"
            />
            <FormField
              label="Designation / Role"
              name="designationRole"
              register={register}
              errors={errors}
              placeholder="e.g., CEO at TechSoft"
            />
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
            <FormField
              label="Company / Organization"
              name="company"
              register={register}
              errors={errors}
              placeholder="e.g., TechSoft Solutions"
            />

            <FileInputField
              label="Profile Image (optional)"
              name="clientImage"
              register={register}
              error={errors['clientImage']}
              existingFileUrl={testimonial?.clientImage?.url || ''}
              required={false}
              fieldBase={fieldBase}
            />
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
            <div className="w-full flex flex-col gap-0.5">
              <label className="w-full flex flex-col">
                <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
                  Rating
                </span>
                <select
                  className={fieldBase}
                  {...register('ratting', {
                    required: 'Rating is required!',
                    validate: value => {
                      const validOptions = ['1', '2', '3', '4', '5']
                      return validOptions.includes(value) || 'Invalid rating selected'
                    },
                  })}
                >
                  <option className="bg-black" value={''}>
                    -- Select Ratting --
                  </option>
                  <option className="bg-black" value={'1'}>
                    1
                  </option>
                  <option className="bg-black" value={'2'}>
                    2
                  </option>
                  <option className="bg-black" value={'3'}>
                    3
                  </option>
                  <option className="bg-black" value={'4'}>
                    4
                  </option>
                  <option className="bg-black" value={'5'}>
                    5
                  </option>
                </select>
              </label>
              {errors['ratting'] && (
                <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                  {errors['ratting'].message}
                </span>
              )}
            </div>
            <div className="w-full flex flex-col gap-0.5">
              <label className="w-full flex flex-col">
                <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
                  Project Title
                </span>
                <select
                  className={fieldBase}
                  {...register('projectTitle', { required: 'Please select a project title' })}
                >
                  <option className="bg-black" value="">
                    -- Select Project Title --
                  </option>
                  {projects.map((item, idx) => {
                    return (
                      <option key={idx} className="bg-black" value={item.id}>
                        {item?.title}
                      </option>
                    )
                  })}
                </select>
              </label>
              {errors['projectTitle'] && (
                <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                  {errors['projectTitle'].message}
                </span>
              )}
            </div>
          </div>

          {/* Row 4 */}

          <div className="w-full flex flex-col gap-0.5">
            <label className="flex flex-col">
              <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
                Testimonial Date
              </span>
              <input
                type="date"
                {...register('testimonialDate', { required: 'Testimonial Date is required' })}
                className={`${fieldBase} cursor-pointer ${
                  errors.testimonialDate ? 'border-red-500' : ''
                }`}
              />
            </label>

            {errors['testimonialDate'] && (
              <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                {errors['testimonialDate']?.message}
              </span>
            )}
          </div>

          {/* client message */}
          <div className="flex flex-col">
            <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
              Message
            </span>
            <textarea
              rows="5"
              {...register('message', { required: 'Client message is required' })}
              placeholder="Enter your client message"
              className={`${fieldBase} resize-none ${errors.message ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.message && (
              <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                {errors.message.message}
              </span>
            )}
          </div>

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
                'Add Testimonial'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  )
}

export default DTestimonialForm
