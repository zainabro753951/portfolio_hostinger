import React, { useEffect, useState, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import {
  User,
  Briefcase,
  Award,
  Clock,
  FileText,
  AlignLeft,
  ImageIcon,
  Loader2,
  Save,
  X,
  Camera,
} from "lucide-react";
import { useSelector } from "react-redux";
import FormField from "../../Components/FormField";
import TextareaField from "../../Components/TextAreaField";
import { useAddAbout } from "../../../../Queries/AddAbout";
import { glassToast } from "../../Components/ToastMessage";

const AboutForm = () => {
  const { data: about } = useSelector((state) => state.about);
  const [aboutPreview, setAboutPreview] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isAboutImageRemoved, setIsAboutImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      shortRole: "",
      successNote: "",
      experience: "",
      shortDesc: "",
      longDesc: "",
      aboutImage: null,
    },
  });

  const aboutImage = watch("aboutImage");

  // Prefill when data comes from Redux
  useEffect(() => {
    if (about && Object.keys(about).length > 0) {
      reset({
        fullName: about?.fullName || "",
        shortRole: about?.shortRole || "",
        successNote: about?.successNote || "",
        experience: about?.experience || "",
        shortDesc: about?.shortDesc || "",
        longDesc: about?.longDesc || "",
      });

      setAboutPreview(
        about?.aboutImage
          ? `${import.meta.env.VITE_BACKEND_URL_FOR_IMAGE}${about?.aboutImage?.url}`
          : null,
      );
      setIsUpdate(true);
    }
  }, [about, reset]);

  useEffect(() => {
    if (aboutImage && aboutImage?.[0]) {
      setAboutPreview(URL.createObjectURL(aboutImage[0]));
      setIsAboutImageRemoved(false);
    }
  }, [aboutImage]);

  const { mutate, isPending, isError, isSuccess, data, error } = useAddAbout();

  // Form Submit
  const onSubmit = useCallback(
    (formData) => {
      const fd = new FormData();

      fd.append("isUpdate", isUpdate ? "true" : "false");
      fd.append("fullName", formData.fullName);
      fd.append("shortRole", formData.shortRole);
      fd.append("successNote", formData.successNote);
      fd.append("experience", formData.experience);
      fd.append("shortDesc", formData.shortDesc);
      fd.append("longDesc", formData.longDesc);
      fd.append("isAboutImageRemoved", JSON.stringify(isAboutImageRemoved));

      // Handle image
      if (formData.aboutImage && formData.aboutImage[0]) {
        fd.append("aboutImage", formData.aboutImage[0]);
      }

      fd.append(
        "aboutImageOBJ",
        about?.aboutImage ? JSON.stringify(about.aboutImage) : "null",
      );

      mutate(fd);
    },
    [isUpdate, isAboutImageRemoved, about, mutate],
  );

  // Toast Feedback
  useEffect(() => {
    if (isSuccess && data) {
      glassToast.success(data?.message || "About info saved successfully!");
    }
    if (isError && error) {
      glassToast.error(
        error?.response?.data?.message || "Something went wrong",
      );
    }
  }, [isSuccess, isError, data, error]);

  // Remove image handler
  const handleRemoveImage = useCallback(() => {
    setValue("aboutImage", null);
    setAboutPreview(null);
    setIsAboutImageRemoved(true);
  }, [setValue]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              About / Profile
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              {isUpdate
                ? "Update your profile information"
                : "Create your profile"}
            </p>
          </div>
        </div>
      </motion.div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {/* Profile Image Section */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Profile Image
              </h2>
            </div>

            {/* Image Preview */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-cyan-400/30 overflow-hidden bg-slate-800/50 flex items-center justify-center group">
                {aboutPreview ? (
                  <>
                    <img
                      src={aboutPreview}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <User className="w-16 h-16 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No image uploaded</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div>
                  <label
                    htmlFor="aboutImage"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Upload
                  </label>
                  <input
                    type="file"
                    id="aboutImage"
                    name="aboutImage"
                    accept="image/*"
                    onClick={() => setIsAboutImageRemoved(false)}
                    {...register("aboutImage")}
                    hidden
                  />
                </div>

                {aboutPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              {errors.aboutImage && (
                <p className="text-rose-400 text-sm text-center">
                  {errors.aboutImage.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Form Details Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Profile Details
              </h2>
            </div>

            <div className="space-y-5">
              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  name="fullName"
                  register={register}
                  errors={errors}
                  placeholder="John Doe"
                  icon={User}
                />
                <FormField
                  label="Short Title / Role"
                  name="shortRole"
                  register={register}
                  errors={errors}
                  placeholder="Full Stack Developer"
                  icon={Briefcase}
                />
              </div>

              {/* Row 2: Success Note & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Success Note"
                  name="successNote"
                  register={register}
                  errors={errors}
                  required={false}
                  placeholder="e.g., 100+ Projects Completed"
                  icon={Award}
                />
                <FormField
                  label="Experience (years)"
                  name="experience"
                  type="number"
                  register={register}
                  errors={errors}
                  required={false}
                  placeholder="5"
                  icon={Clock}
                />
              </div>

              {/* Short Description */}
              <TextareaField
                label="Short Description"
                name="shortDesc"
                register={register}
                errors={errors}
                rows={4}
                placeholder="Brief introduction about yourself (max 200 characters)..."
                icon={AlignLeft}
              />

              {/* Long Description */}
              <TextareaField
                label="Long Description"
                name="longDesc"
                register={register}
                errors={errors}
                rows={8}
                placeholder="Detailed description of your background, skills, and achievements..."
                icon={FileText}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {isUpdate ? "Update Profile" : "Save Profile"}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default memo(AboutForm);
