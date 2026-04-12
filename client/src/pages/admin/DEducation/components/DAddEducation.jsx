import React, { memo, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  BookOpen,
  MapPin,
  Calendar,
  Award,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import FormField from "../../Components/FormField";
import FileInputField from "../../Components/FileInputField";
import { useAddEducation } from "../../../../Queries/AddEducation";
import { glassToast } from "../../Components/ToastMessage";
import {
  educFindById,
  clearFindedEduc,
} from "../../../../features/educationSlice";

const DAddEducation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { educations, education } = useSelector((state) => state.education);
  const [isUpdate, setIsUpdate] = useState(false);

  const defaultValues = {
    institutionName: "",
    degree: "",
    fieldStudy: "",
    grade: "",
    startYear: "",
    endYear: "",
    location: "",
    certificate: "",
    eduDesc: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Fetch education for edit
  useEffect(() => {
    if (id && educations?.length > 0) {
      dispatch(educFindById(Number(id)));
    } else {
      dispatch(clearFindedEduc());
      reset(defaultValues);
      setIsUpdate(false);
    }
  }, [id, educations, dispatch, reset]);

  // Populate form
  useEffect(() => {
    if (id && education && education?.id === Number(id)) {
      reset({
        institutionName: education?.institutionName || "",
        degree: education?.degree || "",
        fieldStudy: education?.fieldStudy || "",
        grade: education?.grade || "",
        startYear: education?.startYear || "",
        endYear: education?.endYear || "",
        location: education?.location || "",
        eduDesc: education?.eduDesc || "",
      });
      setIsUpdate(true);
    }
  }, [id, education, reset]);

  const { mutate, isPending, isError, isSuccess, data, error } =
    useAddEducation();

  const onSubmit = useCallback(
    (formData) => {
      const fd = new FormData();
      fd.append("isUpdate", isUpdate);
      fd.append("educationId", isUpdate ? id : "");
      fd.append(
        "certificateOBJ",
        isUpdate && education?.certificate
          ? JSON.stringify(education?.certificate)
          : "",
      );

      if (formData.certificate && formData.certificate[0]) {
        fd.append("certificate", formData.certificate[0]);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "certificate" && value !== undefined && value !== null) {
          fd.append(key, value);
        }
      });

      mutate(fd);
    },
    [isUpdate, id, education, mutate],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess) {
      glassToast.success(
        data?.message ||
          `Education ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) {
        reset(defaultValues);
      }
    }
    if (isError) {
      glassToast.error(
        error?.response?.data?.message || "Failed to save education",
      );
    }
  }, [isSuccess, isError, data, error, isUpdate, reset]);

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
    resize-none
  `.trim();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full  "
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isUpdate ? "Edit Education" : "Add Education"}
            </h3>
            <p className="text-slate-400 text-sm">
              {isUpdate
                ? "Update education details"
                : "Add your academic background"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-full flex flex-col gap-6"
        >
          {/* Institution & Degree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Institution Name"
              name="institutionName"
              register={register}
              errors={errors}
              placeholder="e.g., Sindh Agricultural University"
              icon={Building2}
            />
            <FormField
              label="Degree"
              name="degree"
              register={register}
              errors={errors}
              placeholder="e.g., Bachelor of Computer Science"
              icon={Award}
            />
          </div>

          {/* Field & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Field of Study"
              name="fieldStudy"
              register={register}
              errors={errors}
              placeholder="e.g., Information Technology"
              icon={BookOpen}
            />
            <FormField
              label="Grade / CGPA"
              name="grade"
              register={register}
              errors={errors}
              required={false}
              placeholder="e.g., 3.8 CGPA"
              icon={Award}
            />
          </div>

          {/* Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Start Year"
              name="startYear"
              type="number"
              register={register}
              errors={errors}
              placeholder="e.g., 2021"
              icon={Calendar}
            />
            <FormField
              label="End Year"
              name="endYear"
              type="number"
              register={register}
              errors={errors}
              placeholder="e.g., 2025"
              icon={Calendar}
            />
          </div>

          {/* Location & Certificate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Location"
              name="location"
              register={register}
              errors={errors}
              required={false}
              placeholder="e.g., Tandojam, Sindh"
              icon={MapPin}
            />
            <FileInputField
              label="Upload Certificate (optional)"
              name="certificate"
              register={register}
              error={errors["certificate"]}
              existingFileUrl={education?.certificate?.url || ""}
              required={false}
              accept="image/*,.pdf"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Description
            </label>
            <textarea
              rows={5}
              {...register("eduDesc", {
                required: "Education description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters long",
                },
                maxLength: {
                  value: 300,
                  message: "Description cannot exceed 300 characters",
                },
                validate: {
                  noNumbersOnly: (value) =>
                    !/^\d+$/.test(value) ||
                    "Description cannot contain only numbers",
                  noSpecialCharsOnly: (value) =>
                    !/^[^a-zA-Z0-9]+$/.test(value) ||
                    "Description must contain letters or words",
                },
              })}
              placeholder="Describe your coursework, achievements, or focus areas..."
              className={inputClasses(errors.eduDesc)}
            />
            {errors.eduDesc && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <span className="text-red-500">•</span>
                {errors.eduDesc?.message}
              </p>
            )}
          </div>

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
                  {isUpdate ? "Update Education" : "Add Education"}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default memo(DAddEducation);
