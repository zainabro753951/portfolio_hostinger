import React, {
  memo,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  User,
  Building2,
  Briefcase,
  Star,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  Save,
  Quote,
} from "lucide-react";
import FormField from "../../Components/FormField";
import FileInputField from "../../Components/FileInputField";
import SelectField from "../../Components/SelectField";
import TextareaField from "../../Components/TextAreaField";
import { useAddTestimonial } from "../../../../Queries/AddTestimonial";
import { glassToast } from "../../Components/ToastMessage";
import {
  clearTestimonial,
  testiFindById,
} from "../../../../features/testimonialSlice";
import { safeParse } from "../../../../Utils/Utils";
import useScrollToRef from "@/hooks/useScrollToRef";

const DTestimonialForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { projects } = useSelector((state) => state.projects);
  const { testimonials, testimonial } = useSelector(
    (state) => state.testimonial,
  );
  const [isUpdate, setIsUpdate] = useState(false);
  const updateTestiRef = useRef(null);
  const clientImage = safeParse(testimonial?.clientImage);

  const defaultValues = useMemo(
    () => ({
      clientName: "",
      designationRole: "",
      company: "",
      clientImage: null,
      ratting: "",
      projectId: "",
      testimonialDate: "",
      message: "",
    }),
    [],
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Watch clientImage for debugging
  const watchedClientImage = watch("clientImage");

  // Fetch testimonial for edit
  useEffect(() => {
    if (id && testimonials?.length > 0) {
      dispatch(testiFindById(Number(id)));
    } else {
      dispatch(clearTestimonial());
      reset(defaultValues);
      setIsUpdate(false);
    }
  }, [id, testimonials, dispatch, reset, defaultValues]);

  // Populate form
  useEffect(() => {
    if (id && testimonial && testimonial?.id === Number(id)) {
      const formattedDate = testimonial.testimonialDate
        ? testimonial.testimonialDate.split("T")[0]
        : "";

      reset({
        clientName: testimonial?.clientName || "",
        designationRole: testimonial?.designationRole || "",
        company: testimonial?.company || "",
        clientImage: testimonial?.clientImage || null,
        ratting: testimonial?.ratting
          ? parseFloat(testimonial?.ratting).toString()
          : "",
        projectId: testimonial?.projectId?.toString() || "",
        testimonialDate: formattedDate,
        message: testimonial?.message || "",
      });
      setIsUpdate(true);
    }
  }, [id, testimonial, reset]);

  // ✅ Sirf tab scroll kare jab id  ho
  useScrollToRef(updateTestiRef, [id], { block: "nearest" }, !!id);

  const { mutate, isPending, isError, isSuccess, data, error } =
    useAddTestimonial();

  const onSubmit = useCallback(
    (formData) => {
      const fd = new FormData();
      fd.append("isUpdate", isUpdate);
      fd.append("testimonialID", isUpdate ? id : "");
      fd.append(
        "clientImageOBJ",
        isUpdate && clientImage ? JSON.stringify(clientImage) : "",
      );

      // File handling - check if clientImage is FileList or single file
      if (formData.clientImage instanceof File) {
        fd.append("clientImage", formData.clientImage);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "clientImage" && value !== undefined && value !== null) {
          fd.append(key, value);
        }
      });

      mutate(fd);
    },
    [isUpdate, id, testimonial, mutate],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess) {
      glassToast.success(
        data?.message ||
          `Testimonial ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) {
        reset(defaultValues);
      }
    }
    if (isError) {
      console.error(error?.response);

      glassToast.error(
        error?.response?.data?.message || "Failed to save testimonial",
      );
    }
  }, [isSuccess, isError, data, error, isUpdate, reset, defaultValues]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const inputClasses = (hasError) =>
    `
    w-full bg-slate-800/50 border ${hasError ? "border-rose-500/50" : "border-white/10"} 
    rounded-xl outline-none text-white placeholder:text-slate-500 
    backdrop-blur-sm px-4 py-3 transition-all duration-200
    focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
    hover:border-white/20 hover:bg-slate-800/70
  `.trim();

  // Rating options with stars
  const ratingOptions = useMemo(
    () => [
      { value: "1", label: "⭐ 1 - Poor" },
      { value: "2", label: "⭐⭐ 2 - Fair" },
      { value: "3", label: "⭐⭐⭐ 3 - Good" },
      { value: "4", label: "⭐⭐⭐⭐ 4 - Very Good" },
      { value: "5", label: "⭐⭐⭐⭐⭐ 5 - Excellent" },
    ],
    [],
  );

  // Project options
  const projectOptions = useMemo(
    () =>
      projects.map((item) => ({
        value: item.id,
        label: item?.title,
      })),
    [projects],
  );

  return (
    <FormProvider {...methods}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full "
      >
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isUpdate ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <p className="text-slate-400 text-sm">
                {isUpdate
                  ? "Update client testimonial details"
                  : "Add a new client testimonial"}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            ref={updateTestiRef}
            className="w-full flex flex-col gap-6"
          >
            {/* Client Name & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Client Name"
                name="clientName"
                register={register}
                errors={errors}
                placeholder="e.g., John Doe"
                icon={User}
                autocomplete="name"
              />
              <FormField
                label="Designation / Role"
                name="designationRole"
                register={register}
                errors={errors}
                placeholder="e.g., CEO at TechSoft"
                icon={Briefcase}
                autocomplete="designation"
              />
            </div>

            {/* Company & Profile Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Company / Organization"
                name="company"
                register={register}
                errors={errors}
                placeholder="e.g., TechSoft Solutions"
                icon={Building2}
              />
              {/* Testimonial Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Testimonial Date
                </label>
                <input
                  type="date"
                  {...register("testimonialDate", {
                    required: "Testimonial date is required",
                  })}
                  className={inputClasses(errors.testimonialDate)}
                />
                {errors.testimonialDate && (
                  <p className="text-xs text-rose-400">
                    {errors.testimonialDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rating & Project Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Rating"
                name="ratting"
                register={register}
                errors={errors}
                required={true}
                placeholder="-- Select Rating --"
                options={ratingOptions}
              />
              <SelectField
                label="Project Title"
                name="projectId"
                register={register}
                errors={errors}
                required={true}
                placeholder="-- Select Project --"
                options={projectOptions}
              />
            </div>

            {/* Client Image */}
            <FileInputField
              label="Profile Image"
              name="clientImage"
              error={errors["clientImage"]}
              existingFileUrl={clientImage?.url || ""}
              required={false}
              accept="image/*"
            />

            {/* Message */}
            <TextareaField
              label="Testimonial Message"
              name="message"
              register={register}
              errors={errors}
              rows={5}
              setValue={setValue}
              placeholder="Share what the client said about your work..."
              icon={MessageSquare}
            />

            {/* Submit Button */}
            <div className="w-full flex items-center justify-end pt-4">
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={
                  prefersReducedMotion || isPending ? {} : { scale: 1.02 }
                }
                whileTap={isPending ? {} : { scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isUpdate ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isUpdate ? "Update Testimonial" : "Add Testimonial"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </FormProvider>
  );
};

export default memo(DTestimonialForm);
