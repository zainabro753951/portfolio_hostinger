import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAddSkills } from '../../../../Queries/AddSkills'
import { glassToast } from '../../Components/ToastMessage'
import { ThreeCircles } from 'react-loader-spinner'
import { motion } from 'motion/react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSkill, skillFindById } from '../../../../features/skillSlice'

const fieldBase =
  'w-full bg-gradient-to-r from-white/6 to-white/3 border border-cyan-400/20 focus:border-cyan-300/70 md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] outline-none text-white placeholder:text-gray-400 backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] transition-shadow duration-200 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[3.1vw] focus:ring-theme-cyan/30 focus:ring-3 md:text-[1vw] sm:text-[2vw] xs:text-[3vw]'

const SkillsForm = () => {
  const { skills, skill } = useSelector(state => state.skills)
  const [isUpdate, setIsUpdate] = useState(false)
  const { id } = useParams()
  const dispatch = useDispatch()

  const defaultValues = {
    skillName: '',
    proficiency: '',
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
    if (id && skills?.length > 0) {
      dispatch(skillFindById(Number(id)))
    } else {
      dispatch(clearSkill())
      reset(defaultValues)
    }
  }, [id, skills, reset])

  useEffect(() => {
    if (id && skill && skill?.id === Number(id)) {
      reset({
        skillName: skill?.skillName,
        proficiency: skill?.proficiency,
      })
      setIsUpdate(true)
    }
  }, [id, skill, reset])

  const { mutate, isPending, isError, isSuccess, data, error } = useAddSkills()

  const onSubmit = formData => {
    mutate({
      isUpdate,
      skillId: isUpdate ? id : '',
      skillName: formData.skillName.trim(),
      proficiency: formData.proficiency,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message, 'success')
    }
    if (isError) {
      glassToast(error?.response?.data?.message, 'error')
    }
  }, [isSuccess, isError])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex xs:flex-col md:flex-row items-start md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw]"
    >
      {/* Skill Name */}
      <div className="w-full flex flex-col gap-0.5">
        <input
          type="text"
          {...register('skillName', {
            required: 'Skill name is required',
            minLength: { value: 2, message: 'At least 2 characters' },
            maxLength: { value: 30, message: 'Cannot exceed 30 characters' },
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: 'Skill name should contain only letters and spaces',
            },
          })}
          placeholder="Write your skill name"
          className={`${fieldBase} ${errors.skillName ? 'border-red-500' : ''}`}
        />
        {errors.skillName && (
          <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
            {errors.skillName.message}
          </span>
        )}
      </div>

      {/* Proficiency (0–100) */}
      <div className="w-full flex flex-col gap-0.5">
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          onInput={e => {
            const value = Number(e.target.value)
            if (value < 0) e.target.value = 0
            if (value > 100) e.target.value = 100
          }}
          {...register('proficiency', {
            required: 'Proficiency is required (0–100)',
            valueAsNumber: true,
            min: { value: 0, message: 'Minimum value is 0' },
            max: { value: 100, message: 'Maximum value is 100' },
            validate: value => !isNaN(value) || 'Proficiency must be a valid number',
          })}
          placeholder="Proficiency (0–100)"
          className={`${fieldBase} ${errors.proficiency ? 'border-red-500' : ''}`}
        />

        {errors.proficiency && (
          <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
            {errors.proficiency.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 200 }}
        whileTap={{ scale: 0.98 }}
        className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] flex items-center justify-center"
        title={isPending ? 'Loading...' : ''}
        type={isPending ? 'button' : 'submit'}
      >
        {isPending ? <ThreeCircles visible color="#ff657c" width={20} height={20} /> : 'Save'}
      </motion.button>
    </form>
  )
}

export default SkillsForm
