import React, { memo, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "motion/react";
import {
  Wrench,
  Gauge,
  Save,
  Loader2,
  AlertCircle,
  Plus,
  Pencil,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddSkills } from "../../../../Queries/AddSkills";
import { glassToast } from "../../Components/ToastMessage";
import { clearSkill, skillFindById } from "../../../../features/skillSlice";

const SkillsForm = () => {
  const { skills, skill } = useSelector((state) => state.skills);
  const prefersReducedMotion = useReducedMotion();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = {
    skillName: "",
    proficiency: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Fetch skill for edit
  useEffect(() => {
    if (id && skills?.length > 0) {
      dispatch(skillFindById(Number(id)));
    } else {
      dispatch(clearSkill());
      reset(defaultValues);
      setIsUpdate(false);
    }
  }, [id, skills, dispatch, reset]);

  // Populate form when skill data arrives
  useEffect(() => {
    if (id && skill && skill?.id === Number(id)) {
      reset({
        skillName: skill?.skillName || "",
        proficiency: skill?.proficiency || "",
      });
      setIsUpdate(true);
    }
  }, [id, skill, reset]);

  const { mutate, isPending, isError, isSuccess, data, error } = useAddSkills();

  // Form submission
  const onSubmit = useCallback(
    (formData) => {
      mutate({
        isUpdate,
        skillId: isUpdate ? id : "",
        skillName: formData.skillName.trim(),
        proficiency: Number(formData.proficiency),
      });
    },
    [isUpdate, id, mutate],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess) {
      glassToast.success(
        data?.message ||
          `Skill ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) {
        reset(defaultValues);
      }
    }
    if (isError) {
      glassToast.error(
        error?.response?.data?.message || "Failed to save skill",
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
  `.trim();

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full"
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            {isUpdate ? (
              <Pencil className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isUpdate ? "Edit Skill" : "Add New Skill"}
            </h2>
            <p className="text-slate-400 text-sm">
              {isUpdate
                ? "Update skill details"
                : "Add a new skill to your portfolio"}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Skill Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-500" />
              Skill Name
            </label>
            <input
              type="text"
              {...register("skillName", {
                required: "Skill name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: {
                  value: 30,
                  message: "Cannot exceed 30 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only letters and spaces allowed",
                },
              })}
              placeholder="e.g. React, Node.js, Figma"
              className={inputClasses(errors.skillName)}
            />
            {errors.skillName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.skillName.message}
              </motion.p>
            )}
          </div>

          {/* Proficiency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-500" />
              Proficiency (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                {...register("proficiency", {
                  required: "Proficiency is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum is 0%" },
                  max: { value: 100, message: "Maximum is 100%" },
                  validate: (value) =>
                    !isNaN(value) || "Must be a valid number",
                })}
                placeholder="0-100"
                className={inputClasses(errors.proficiency)}
                onInput={(e) => {
                  const value = Number(e.target.value);
                  if (value < 0) e.target.value = 0;
                  if (value > 100) e.target.value = 100;
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                %
              </span>
            </div>
            {errors.proficiency && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.proficiency.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Proficiency Preview */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Proficiency Preview</span>
            <span className="text-cyan-400 font-medium">
              {isUpdate ? skill?.proficiency || 0 : 0}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${isUpdate ? skill?.proficiency || 0 : 0}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isPending}
          whileHover={prefersReducedMotion || isPending ? {} : { scale: 1.02 }}
          whileTap={isPending ? {} : { scale: 0.98 }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isUpdate ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isUpdate ? "Update Skill" : "Add Skill"}
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default memo(SkillsForm);
