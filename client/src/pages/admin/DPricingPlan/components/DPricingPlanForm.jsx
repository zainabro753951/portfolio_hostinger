import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FaCode } from 'react-icons/fa6'
import { useAddPricePlan } from '../../../../Queries/AddPlan'
import { glassToast } from '../../Components/ToastMessage'
import { ThreeCircles } from 'react-loader-spinner'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearPlan, planFindById } from '../../../../features/planSlice'

const glassClass = `
  w-full bg-gradient-to-br from-[#0a0a2a]/70 to-[#101040]/40
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
  md:placeholder:text-[1vw] xs:placeholder:text-[2vw] xs:placeholder:text-[4vw]
  md:text-[1vw] sm:text-[2vw] xs:text-[3vw]
`

const DPricingPlanForm = () => {
  const { plans, plan } = useSelector(state => state.plan)
  const { id } = useParams()
  const dispatch = useDispatch()
  const [isUpdate, setIsUpdate] = useState(false)

  const defaultValues = {
    planName: '',
    billingCycle: '',
    price: '',
    currency: '',
    featurePoints: [],
    shortDesc: '',
  }

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  useEffect(() => {
    if (id && plans.length > 0) {
      dispatch(planFindById(Number(id)))
    } else {
      dispatch(clearPlan())
      reset(defaultValues)
    }
  }, [id, dispatch, plans])

  useEffect(() => {
    if (plan && id && plan.id === Number(id)) {
      reset({
        planName: plan?.planName || '',
        billingCycle: plan?.billingCycle || '',
        price: plan?.price || '',
        currency: plan?.currency || '',
        featurePoints: plan?.featurePoints || [],
        shortDesc: plan?.shortDesc || '',
      })
      setIsUpdate(true)
    }
  }, [plan, id])

  const {
    fields: featurePointField,
    append: appendFeaturePoint,
    remove: removeFeaturePoint,
  } = useFieldArray({
    control,
    name: 'featurePoints',
  })

  const addFeaturePoint = e => {
    e.preventDefault()
    const input = e.target.form.querySelector('#featurePoints')

    const value = input.value.trim()

    // --- Clear old error
    clearErrors('featurePoints')

    // --- Validation checks
    if (!value) {
      setError('featurePoints', { type: 'required', message: 'Tech is required' })
      return
    }

    if (value.length < 2) {
      setError('featurePoints', {
        type: 'minLength',
        message: 'Tech must be at least 2 characters',
      })
      return
    }

    const isDuplicate = featurePointField.some(t => t.name.toLowerCase() === value.toLowerCase())
    if (isDuplicate) {
      setError('featurePoints', { type: 'duplicate', message: 'This tech already exists' })
      return
    }

    appendFeaturePoint({ name: value })
    input.value = ''
  }

  const { mutate, isPending, isSuccess, isError, data, error } = useAddPricePlan()

  const onSubmit = data => {
    console.log(data)
    mutate({ isUpdate, planId: id, ...data })
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
        Add Plan
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col md:gap-[1.2vw] sm:gap-[2.2vw] xs:gap-[3.2vw]"
      >
        {/* Row 1 */}
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
          <div className="w-full flex flex-col gap-0.5">
            <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
              Plan Name
            </span>
            <label>
              <select
                className={fieldBase}
                {...register('planName', {
                  required: 'Please select a proficiency level',
                })}
              >
                <option className="bg-black" value={''}>
                  -- Select Plan Name --
                </option>
                <option className="bg-black" value={'basic'}>
                  Basic
                </option>
                <option className="bg-black" value={'standard'}>
                  Standard
                </option>
                <option className="bg-black" value={'premium'}>
                  Premium
                </option>
                <option className="bg-black" value={'enterprise'}>
                  Enterprise
                </option>
              </select>
            </label>
            {errors.planName && (
              <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div className="w-full flex flex-col gap-0.5">
            <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
              Billing Cycle
            </span>
            <label>
              <select
                className={fieldBase}
                {...register('billingCycle', {
                  required: 'Please select a proficiency level',
                })}
              >
                <option className="bg-black" value={''}>
                  -- Select Billing Cycle --
                </option>
                <option className="bg-black" value={'Monthly'}>
                  Monthly
                </option>
                <option className="bg-black" value={'One-time'}>
                  One-time
                </option>
                <option className="bg-black" value={'Lifetime'}>
                  Lifetime
                </option>
              </select>
            </label>
            {errors.billingCycle && (
              <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                This field is required
              </span>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="w-full grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
          <div className="w-full flex flex-col ">
            <label className="flex flex-col">
              <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                Price
              </span>
              <input
                type="number"
                min="1"
                onKeyDown={e => {
                  if (e.key === '-' || e.key === 'e' || e.key === '+') {
                    e.preventDefault()
                  }
                }}
                {...register('price', {
                  required: 'Price is required',
                  min: {
                    value: 1,
                    message: 'Price must be greater than 0',
                  },
                })}
                placeholder="Enter price"
                className={fieldBase}
              />
            </label>
            {errors.title && (
              <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                {errors.title?.message}
              </span>
            )}
          </div>
          <div className="w-full flex flex-col gap-0.5">
            <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
              Currency
            </span>
            <label>
              <select
                className={fieldBase}
                {...register('currency', {
                  required: 'Please select a proficiency level',
                })}
              >
                <option className="bg-black" value={''}>
                  -- Select Currency --
                </option>
                <option className="bg-black" value={'$'}>
                  USD
                </option>
                <option className="bg-black" value={'Rs'}>
                  PKR
                </option>
                <option className="bg-black" value={'€'}>
                  EUR
                </option>
              </select>
            </label>
            {errors.currency && (
              <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                This field is required
              </span>
            )}
          </div>
        </div>
        {/* Row 3 */}
        <div className="bg-white/4 backdrop-blur-md border border-white/10 md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw] md:p-[1.2vw] sm:p-[2.2vw] xs:p-[3.2vw]">
          <div className="flex flex-wrap items-center justify-between md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
            <h3 className="font-medium md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
              <FaCode /> Feature Point
            </h3>
            <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
              Press Enter to add
            </small>
          </div>

          <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw] items-center md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
            <input
              id="featurePoints"
              onKeyDown={e => {
                if (e.key === 'Enter') addFeaturePoint(e)
              }}
              placeholder="Add your feature point"
              className={fieldBase}
            />
            <button
              onClick={addFeaturePoint}
              className="md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8 transition md:text-[1vw] sm:text-[2vw] xs:text-[4vw]"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
            {featurePointField.map((t, idx) => (
              <span
                key={idx}
                className="md:px-[1vw] sm:px-[1.5vw] xs:px-[2vw] md:py-[0.4vw] sm:py-[0.9vw] xs:py-[1.4vw] rounded-full bg-white/6 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-white flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]"
              >
                {t.name}
                <button
                  onClick={() => removeFeaturePoint(idx)}
                  className="text-gray-400 hover:text-red-300 ml-2"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Short Description */}
        <div className="flex flex-col">
          <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
            Short Description
          </span>
          <textarea
            rows="5"
            {...register('shortDesc', { required: true })}
            placeholder="e.g., “Perfect for individuals starting out.”"
            className={`${fieldBase} resize-none`}
          ></textarea>
          {errors.shortDesc && (
            <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
              Description is required
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
              'Add Plan'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default DPricingPlanForm
