import React, { useEffect, useState, memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";
import { clearExp, expFindById } from "../../../../features/experienceSlice";
import { useAddFAQ } from "../../../../Queries/AddFAQ";
import { glassToast } from "../../Components/ToastMessage";
import FormField from "../../Components/FormField";
import SelectField from "../../Components/OptionField";
import { ThreeCircles } from "react-loader-spinner";
import TextareaField from "../../Components/TextAreaField";
import { clearFAQ, FAQFindById } from "../../../../features/FAQSlice";

const FAQForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { FAQs, FAQ } = useSelector((state) => state.FAQ);
  const [isUpdate, setIsUpdate] = useState(false);

  const defaultValues = {
    question: "",
    answer: "",
    status: "Published",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Load FAQ data when editing
  useEffect(() => {
    if (id && FAQs?.length > 0) {
      dispatch(FAQFindById(Number(id)));
    } else {
      dispatch(clearFAQ());
      reset(defaultValues);
    }
  }, [id, FAQs, reset, dispatch]);

  // Populate form when FAQ data is loaded
  useEffect(() => {
    if (id && FAQ && FAQ?.id === Number(id)) {
      reset({
        question: FAQ?.question,
        answer: FAQ?.answer,
        status: FAQ?.status || "Published",
      });
      setIsUpdate(true);
    }
  }, [id, FAQ, reset]);

  const { mutate, isPending, isError, isSuccess, data, error } = useAddFAQ();

  // Memoized submit handler
  const onSubmit = useCallback(
    (formData) => {
      mutate({ faqId: id, isUpdate, ...formData });
    },
    [mutate, id, isUpdate],
  );

  // Handle success/error states
  useEffect(() => {
    if (isSuccess && data) {
      glassToast(data?.message, "success");
    }
    if (isError && error) {
      glassToast(
        error?.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  }, [isSuccess, isError, data, error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="
        w-full 
        bg-gradient-to-br from-slate-900/80 to-slate-800/50
        border border-white/15 
        backdrop-blur-2xl
        shadow-[0_8px_40px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]
        p-5 sm:p-6 md:p-8
        rounded-2xl sm:rounded-3xl
        will-change-transform transform-gpu
      "
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2
          className="
          text-white font-bold 
          text-xl sm:text-2xl md:text-2xl 
          tracking-wide
          bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400
          bg-clip-text text-transparent
        "
        >
          {isUpdate ? "✏️ Edit FAQ" : "➕ Add FAQ"}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          {isUpdate
            ? "Update the frequently asked question details below"
            : "Create a new frequently asked question for your users"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="w-full flex flex-col gap-4 sm:gap-5 md:gap-6"
      >
        {/* Row 1: Question & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <FormField
            label="Question"
            name="question"
            register={register}
            errors={errors}
            placeholder="Enter the frequently asked question"
            required={true}
          />
          <SelectField
            label="FAQ Status"
            name="status"
            register={register}
            errors={errors}
            required={true}
            placeholder="-- Select FAQ Status --"
            options={[
              { value: "Published", label: "Published" },
              { value: "Draft", label: "Draft" },
            ]}
          />
        </div>

        {/* Answer Field */}
        <TextareaField
          label="Answer"
          name="answer"
          register={register}
          errors={errors}
          placeholder="Write the detailed answer for this question"
          required={true}
          rows={6}
        />

        {/* Submit Button */}
        <div className="w-full flex items-center justify-end pt-2">
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 30px rgba(34,211,238,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            disabled={isPending}
            className={`
              relative overflow-hidden
              py-3 px-8 sm:py-3.5 sm:px-10 md:px-12
              bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500
              text-white font-semibold
              border border-cyan-400/50
              rounded-xl
              text-sm sm:text-base
              flex items-center justify-center gap-3
              transition-all duration-300
              disabled:opacity-70 disabled:cursor-not-allowed
              shadow-[0_4px_20px_rgba(34,211,238,0.3)]
              hover:shadow-[0_8px_30px_rgba(34,211,238,0.5)]
              will-change-transform transform-gpu
              group
            `}
            type="submit"
          >
            {/* Button Background Animation */}
            <div
              className="
              absolute inset-0 
              bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "
            />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
              {isPending ? (
                <ThreeCircles
                  visible={true}
                  color="#ffffff"
                  width={20}
                  height={20}
                  ariaLabel="loading"
                />
              ) : (
                <>
                  <span>{isUpdate ? "Update FAQ" : "Add FAQ"}</span>
                  {!isPending && (
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
                  )}
                </>
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default memo(FAQForm);
