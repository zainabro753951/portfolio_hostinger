import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { useParams } from 'react-router-dom'
import { clearExp, expFindById } from '../../../../features/experienceSlice'
import { useAddFAQ } from '../../../../Queries/AddFAQ'
import { glassToast } from '../../Components/ToastMessage'
import FormField from '../../Components/FormField'
import SelectField from '../../Components/OptionField'
import { ThreeCircles } from 'react-loader-spinner'
import TextareaField from '../../Components/TextAreaField'
import { clearFAQ, FAQFindById } from '../../../../features/FAQSlice'

const glassClass = `
  w-full bg-gradient-to-br from-[#0a0a2a]/70 to-[#101040]/40
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_30px_rgba(34,211,238,0.25)]
  md:p-[2vw] sm:p-[3vw] xs:p-[4vw]
  md:rounded-[1.5vw] sm:rounded-[2.5vw] xs:rounded-[3.5vw]
`

const FAQForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { FAQs, FAQ } = useSelector(state => state.FAQ)
  const [isUpdate, setIsUpdate] = useState(false)

  const defaultValues = {
    question: '',
    answer: '',
    status: 'Published',
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

  useEffect(() => {
    if (id && FAQs?.length > 0) {
      dispatch(FAQFindById(Number(id)))
    } else {
      dispatch(clearFAQ())
      reset(defaultValues)
    }
  }, [id, FAQs, reset])

  // Education Form Fields update
  useEffect(() => {
    if (id && FAQ && FAQ?.id === Number(id)) {
      reset({
        question: FAQ?.question,
        answer: FAQ?.answer,
        status: FAQ?.status || 'Published',
      })
      setIsUpdate(true)
    }
  }, [id, FAQ, reset])

  const { mutate, isPending, isError, isSuccess, data, error } = useAddFAQ()
  const onSubmit = data => {
    // Append all other fields (except the file)
    mutate({ faqId: id, isUpdate, ...data })
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
            label="Question"
            name="question"
            register={register}
            errors={errors}
            placeholder="Enter the frequently asked question"
          />
          <SelectField
            label="FAQ Status"
            name={`status`}
            register={register}
            errors={errors}
            required={true}
            placeholder="-- Select FAQ Status --"
            options={[
              { value: 'Published', label: 'Published' },
              { value: 'Draft', label: 'Draft' },
            ]}
          />
        </div>

        <TextareaField
          label="Answer"
          name={`answer`}
          register={register}
          errors={errors}
          placeholder="Write the detailed answer for this question"
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

export default FAQForm
