import React, { useEffect } from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import FormField from '../../Components/FormField'
import { useAddEducation } from '../../../../Queries/AddEducation'
import { glassToast } from '../../Components/ToastMessage'
import { ThreeCircles } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { educFindById, clearFindedEduc } from '../../../../features/educationSlice'
import { useState } from 'react'
import FileInputField from '../../Components/FileInputField'

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

const DAddEducation = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { educations, education } = useSelector(state => state.education)
  const [isUpdate, setIsUpdate] = useState(false)
  const defaultValues = {
    institutionName: '',
    degree: '',
    fieldStudy: '',
    grade: '',
    startYear: '',
    endYear: '',
    location: '',
    certificate: '',
    eduDesc: '',
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
    if (id && educations?.length > 0) {
      dispatch(educFindById(Number(id)))
    } else {
      dispatch(clearFindedEduc())
      reset(defaultValues)
    }
  }, [id, educations, reset])

  // Education Form Fields update
  useEffect(() => {
    if (id && education && education?.id === Number(id)) {
      reset({
        institutionName: education?.institutionName,
        degree: education?.degree,
        fieldStudy: education?.fieldStudy,
        grade: education?.grade,
        startYear: education?.startYear,
        endYear: education?.endYear,
        location: education?.location,
        eduDesc: education?.eduDesc,
      })
      setIsUpdate(true)
    }
  }, [id, education, reset])

  const { mutate, isPending, isError, isSuccess, data, error } = useAddEducation()
  const onSubmit = data => {
    const formData = new FormData()
    formData.append('isUpdate', isUpdate)
    formData.append('educationId', isUpdate ? id : null)
    formData.append(
      'certificateOBJ',
      isUpdate && education?.certificate ? JSON.stringify(education?.certificate) : ''
    )

    // ✅ Correct file handling
    if (data.certificate && data.certificate[0]) {
      formData.append('certificate', data.certificate[0]) // only append the file itself
    }

    // Append all other fields (except the file)
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'certificate' && value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })

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
        🎓 Add Education
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="w-full flex flex-col md:gap-[1.2vw] sm:gap-[2.2vw] xs:gap-[3.2vw]"
      >
        {/* Row 1 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw]">
          <FormField
            label="Institution Name"
            name="institutionName"
            register={register}
            errors={errors}
            placeholder="e.g., Sindh Agricultural University"
          />
          <FormField
            label="Degree"
            name="degree"
            register={register}
            errors={errors}
            placeholder="e.g., Bachelor of Computer Science"
          />
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw]">
          <FormField
            label="Field of Study"
            name="fieldStudy"
            register={register}
            errors={errors}
            placeholder="e.g., Information Technology"
          />
          <FormField
            label="Grade / CGPA"
            name="grade"
            register={register}
            errors={errors}
            placeholder="e.g., 3.8 CGPA"
          />
        </div>

        {/* Row 3 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw]">
          <FormField
            label="Start Year"
            name="startYear"
            register={register}
            errors={errors}
            placeholder="e.g., 2021"
          />
          <FormField
            label="End Year"
            name="endYear"
            register={register}
            errors={errors}
            placeholder="e.g., 2025"
          />
        </div>

        {/* Row 4 */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[1vw]">
          <FormField
            label="Location"
            name="location"
            register={register}
            errors={errors}
            placeholder="e.g., Tandojam, Sindh"
          />

          <FileInputField
            label="Upload Certificate (optional)"
            name="certificate"
            register={register}
            error={errors['certificate']}
            existingFileUrl={education?.certificate?.url || ''}
            required={false}
            fieldBase={fieldBase}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
            Description
          </span>
          <textarea
            rows="5"
            {...register('eduDesc', {
              required: 'Education description is required',
              minLength: {
                value: 20,
                message: 'Description must be at least 20 characters long',
              },
              maxLength: {
                value: 300,
                message: 'Description cannot exceed 300 characters',
              },
              validate: {
                noNumbersOnly: value =>
                  !/^\d+$/.test(value) || 'Description cannot contain only numbers',
                noSpecialCharsOnly: value =>
                  !/^[^a-zA-Z0-9]+$/.test(value) || 'Description must contain letters or words',
              },
            })}
            placeholder="Describe your coursework, achievements, or focus areas..."
            className={`${fieldBase} resize-none`}
          ></textarea>
          {errors.eduDesc && (
            <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
              {errors.eduDesc?.message}
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
              'Add Education'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default DAddEducation
