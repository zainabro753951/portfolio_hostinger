import React, {
  memo,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  Wrench,
} from "lucide-react";
import FormField from "../../Components/FormField";
import FileInputField from "../../Components/FileInputField";
import SelectField from "../../Components/SelectField";
import TextareaField from "../../Components/TextAreaField";
import { useAddExperience } from "../../../../Queries/AddExperience";
import { glassToast } from "../../Components/ToastMessage";
import { clearExp, expFindById } from "../../../../features/experienceSlice";
import useScrollToRef from "@/hooks/useScrollToRef";
import { safeParse } from "../../../../Utils/Utils";

const ExpForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { experiences, experience } = useSelector((state) => state.experience);
  const [isUpdate, setIsUpdate] = useState(false);
  const updateExpRef = useRef(null);
  const companyLogo = safeParse(experience?.companyLogo);

  const defaultValues = useMemo(
    () => ({
      position: "",
      company: "",
      employmentType: "",
      startedAt: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
      technologies: "",
      companyLogo: null,
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
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const currentlyWorking = watch("currentlyWorking", false);

  // Handle Reset
  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  // Fetch experience for edit
  useEffect(() => {
    if (id && experiences?.length > 0) {
      dispatch(expFindById(Number(id)));
    } else {
      dispatch(clearExp());
      reset(defaultValues);
      setIsUpdate(false);
    }
  }, [id, experiences, dispatch, reset]);

  // Populate form
  useEffect(() => {
    if (id && experience && experience?.id === Number(id)) {
      const formattedStartedAt = experience?.startedAt
        ? new Date(experience.startedAt).toISOString().split("T")[0]
        : "";

      const formattedEndDate = experience?.endDate
        ? new Date(experience.endDate).toISOString().split("T")[0]
        : "";

      reset({
        position: experience?.position || "",
        company: experience?.company || "",
        employmentType: experience?.employmentType || "",
        startedAt: formattedStartedAt,
        endDate: formattedEndDate,
        description: experience?.description || "",
        technologies: experience?.technologies || "",
      });
      setValue("currentlyWorking", experience?.currentlyWorking === 1);
      setIsUpdate(true);
    }
  }, [id, experience, reset, setValue]);

  // ✅ Sirf tab scroll kare jab id  ho
  useScrollToRef(updateExpRef, [id], { block: "nearest" }, !!id);

  const { mutate, isPending, isError, isSuccess, data, error } =
    useAddExperience();

  const existingLogo = useMemo(() => companyLogo, [experience]);

  const onSubmit = useCallback(
    (formData) => {
      const fd = new FormData();
      fd.append("isUpdate", isUpdate);
      fd.append("expId", isUpdate ? id : "");
      fd.append(
        "companyLogoOBJ",
        isUpdate && existingLogo ? JSON.stringify(existingLogo) : null,
      );

      if (formData.companyLogo instanceof File) {
        fd.append("companyLogo", formData.companyLogo);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "companyLogo" && value != null) {
          // ✅ null/undefined dono handle
          fd.append(key, value);
        }
      });

      mutate(fd);
    },
    [isUpdate, id, existingLogo, mutate],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess) {
      glassToast.success(
        data?.message ||
          `Experience ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) {
        handleReset();
      }
    }
    if (isError) {
      glassToast.error(
        error?.response?.data?.message || "Failed to save experience",
      );
    }
  }, [isSuccess, isError, data, error, isUpdate, handleReset]);

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

  const inputClasses = (hasError, disabled = false) =>
    `
    w-full bg-slate-800/50 border ${hasError ? "border-rose-500/50" : "border-white/10"} 
    rounded-xl outline-none text-white placeholder:text-slate-500 
    backdrop-blur-sm px-4 py-3 transition-all duration-200
    focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
    hover:border-white/20 hover:bg-slate-800/70
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `.trim();

  const employmentOptions = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Internship", label: "Internship" },
    { value: "Freelance", label: "Freelance" },
    { value: "Contract", label: "Contract" },
  ];

  return (
    <FormProvider {...methods}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isUpdate ? "Edit Experience" : "Add Experience"}
              </h3>
              <p className="text-slate-400 text-sm">
                {isUpdate
                  ? "Update work experience details"
                  : "Add your professional experience"}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            ref={updateExpRef}
            className="w-full flex flex-col gap-6"
          >
            {/* Position & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Position / Role"
                name="position"
                register={register}
                errors={errors}
                placeholder="e.g., Frontend Developer"
                icon={Briefcase}
              />
              <FormField
                label="Company Name"
                name="company"
                register={register}
                errors={errors}
                placeholder="e.g., Cybrix Pvt. Ltd."
                icon={Building2}
              />
            </div>

            {/* Employment Type & Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Employment Type"
                name="employmentType"
                register={register}
                errors={errors}
                required={true}
                placeholder="-- Select Employment Type --"
                options={employmentOptions}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Started At
                </label>
                <input
                  type="date"
                  {...register("startedAt", {
                    required: "Start date is required",
                  })}
                  className={inputClasses(errors.startedAt)}
                />
                {errors.startedAt && (
                  <p className="text-xs text-rose-400">
                    {errors.startedAt.message}
                  </p>
                )}
              </div>
            </div>

            {/* End Date & Currently Working */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  End Date
                </label>
                <input
                  type="date"
                  {...register("endDate", {
                    required: currentlyWorking ? false : "End date is required",
                  })}
                  className={inputClasses(errors.endDate, currentlyWorking)}
                  disabled={currentlyWorking}
                />
                {errors.endDate && (
                  <p className="text-xs text-rose-400">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("currentlyWorking")}
                  className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700"
                />
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Currently Working
                </span>
              </label>
            </div>

            {/* Logo & Technologies */}
            <FormField
              label="Technologies"
              name="technologies"
              register={register}
              errors={errors}
              required={false}
              placeholder="e.g., React, Node.js, TypeScript"
              icon={Wrench}
            />

            {/* Company Logo */}
            <FileInputField
              label="Company Logo"
              name="companyLogo"
              error={errors["companyLogo"]}
              existingFileUrl={companyLogo?.url || ""}
              required={false}
              accept="image/*"
            />

            {/* Description */}
            <TextareaField
              label="Job Description / Responsibilities"
              name="description"
              register={register}
              errors={errors}
              rows={5}
              placeholder="Describe your role, achievements, and responsibilities..."
              icon={FileText}
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
                    {isUpdate ? "Update Experience" : "Add Experience"}
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

export default memo(ExpForm);
