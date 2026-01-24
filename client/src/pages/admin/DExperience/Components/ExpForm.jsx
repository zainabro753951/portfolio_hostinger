import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAddExperience } from '../../../../Queries/AddExperience'
import { glassToast } from '../../Components/ToastMessage'
import { motion } from 'motion/react'
import FormField from '../../Components/FormField'
import FileInputField from '../../Components/FileInputField'
import SelectField from '../../Components/OptionField'
import TextareaField from '../../Components/TextAreaField'
import { ThreeCircles } from 'react-loader-spinner'
import { clearExp, expFindById } from '../../../../features/experienceSlice'

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

const ExpForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { experiences, experience } = useSelector(state => state.experience)
  const [isUpdate, setIsUpdate] = useState(false)

  const defaultValues = {
    position: '',
    company: '',
    employmentType: '',
    startedAt: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    technologies: '',
    companyLogo: null,
  }
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const currentlyWorking = watch('currentlyWorking', false)
  useEffect(() => {
    if (id && experiences?.length > 0) {
      dispatch(expFindById(Number(id)))
    } else {
      dispatch(clearExp())
      reset(defaultValues)
    }
  }, [id, experiences, reset])

  // Education Form Fields update
  useEffect(() => {
    if (id && experience && experience?.id === Number(id)) {
      const formattedStartedAt = experience?.startedAt
        ? new Date(experience.startedAt).toISOString().split('T')[0]
        : ''

      const formattedEndDate = experience?.endDate
        ? new Date(experience.endDate).toISOString().split('T')[0]
        : ''

      reset({
        position: experience?.position,
        company: experience?.company,
        employmentType: experience?.employmentType,
        startedAt: formattedStartedAt,
        endDate: formattedEndDate,
        description: experience?.description,
        technologies: experience?.technologies,
      })
      setValue('currentlyWorking', experience?.currentlyWorking === 1)
      setIsUpdate(true)
    }
  }, [id, experience, reset])

  const { mutate, isPending, isError, isSuccess, data, error } = useAddExperience()

  const onSubmit = data => {
    const formData = new FormData()
    formData.append('isUpdate', isUpdate)
    formData.append('expId', isUpdate ? id : null)
    formData.append(
      'companyLogoOBJ',
      isUpdate && experience?.companyLogo ? JSON.stringify(experience?.companyLogo) : ''
    )

    // ✅ Correct file handling
    if (data.companyLogo && data.companyLogo[0]) {
      formData.append('companyLogo', data.companyLogo[0]) // only append the file itself
    }

    // Append all other fields (except the file)
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'companyLogo' && value !== undefined && value !== null) {
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
            label="Position / Role"
            name="position"
            register={register}
            errors={errors}
            placeholder="e.g., Frontend Developer, Software Engineer"
          />
          <FormField
            label="Company Name"
            name="company"
            register={register}
            errors={errors}
            placeholder="e.g., Cybrix Pvt. Ltd., Tech Stack Solutions"
          />
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw]">
          <SelectField
            label="Employment Type"
            name={`employmentType`}
            register={register}
            errors={errors}
            required={true}
            placeholder="-- Select Employment Type --"
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Internship', label: 'Internship' },
              { value: 'Freelance', label: 'Freelance' },
              { value: 'Contract', label: 'Contract' },
            ]}
          />
          <div className="w-full flex flex-col gap-0.5">
            <label className="flex flex-col">
              <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
                Started At
              </span>
              <input
                type="date"
                {...register('startedAt', { required: 'Experience started date is required!' })}
                className={`${fieldBase} cursor-pointer ${
                  errors.startedAt ? 'border-red-500' : ''
                }`}
              />
            </label>
            {errors['startedAt'] && (
              <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                {errors['startedAt']?.message}
              </span>
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw] items-center  ">
          <div className="w-full flex flex-col gap-0.5">
            <label className="flex flex-col">
              <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
                End Date
              </span>
              <input
                type="date"
                {...register('endDate', {
                  required: currentlyWorking ? false : 'Experience started date is required!',
                })}
                className={`${fieldBase} cursor-pointer ${
                  currentlyWorking ? 'opacity-60 cursor-not-allowed' : ''
                } ${errors['endDate'] ? 'border-red-500' : ''}`}
                disabled={currentlyWorking}
              />
            </label>
            {errors['endDate'] && (
              <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
                {errors['endDate']?.message}
              </span>
            )}
          </div>
          <label className="flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
            <input
              type="checkbox"
              {...register('currentlyWorking')}
              className="md:w-[1vw] md:h-[1vw] sm:w-[2vw] sm:h-[2vw] xs:w-[3.5vw] xs:h-[3.5vw] accent-cyan-400"
            />
            <span id className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300">
              Currently Working
            </span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw] items-center  ">
          <FileInputField
            label="Company Logo"
            name="companyLogo"
            register={register}
            error={errors['companyLogo']}
            existingFileUrl={experience?.companyLogo?.url || ''}
            required={false}
            fieldBase={fieldBase}
          />

          <FormField
            label="Technologies"
            name="technologies"
            register={register}
            errors={errors}
            placeholder="e.g., HTML, CSS,"
          />
        </div>

        <TextareaField
          label="Job Description / Responsibilities"
          name={`description`}
          register={register}
          errors={errors}
          placeholder="Describe your experience achievements, or responsibilities..."
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
              'Add Education'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default ExpForm
