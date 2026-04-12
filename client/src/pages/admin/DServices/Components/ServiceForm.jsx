import React, { memo, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Briefcase,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  CheckCircle2,
  Layers,
} from "lucide-react";
import FormField from "../../Components/FormField";
import FileInputField from "../../Components/FileInputField";
import SelectField from "../../Components/SelectField";
import TextareaField from "../../Components/TextAreaField";
import { useAddServices } from "../../../../Queries/AddServices";
import { glassToast } from "../../Components/ToastMessage";
import {
  clearService,
  serviceFindById,
} from "../../../../features/serviceSlice";

const ServiceForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { services, service } = useSelector((state) => state.service);
  const [isUpdate, setIsUpdate] = useState(false);

  const defaultValues = {
    title: "",
    shortDesc: "",
    status: "Draft",
    category: "",
    serviceImage: null,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Fetch service for edit
  useEffect(() => {
    if (id && services?.length > 0) {
      dispatch(serviceFindById(Number(id)));
    } else {
      dispatch(clearService());
      reset(defaultValues);
      setIsUpdate(false);
    }
  }, [id, services, dispatch, reset]);

  // Populate form
  useEffect(() => {
    if (id && service && service?.id === Number(id)) {
      reset({
        title: service?.title || "",
        shortDesc: service?.shortDesc || "",
        status: service?.status || "Draft",
        category: service?.category || "",
      });
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
      reset(defaultValues);
    }
  }, [id, service, reset]);

  const { mutate, isPending, isError, isSuccess, data, error } =
    useAddServices();

  const onSubmit = useCallback(
    (formData) => {
      const fd = new FormData();
      fd.append("isUpdate", isUpdate);
      fd.append("serviceId", isUpdate ? id : "");
      fd.append(
        "serviceImageOBJ",
        isUpdate && service?.serviceImage
          ? JSON.stringify(service?.serviceImage)
          : "",
      );

      if (formData.serviceImage && formData.serviceImage[0]) {
        fd.append("serviceImage", formData.serviceImage[0]);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "serviceImage" && value !== undefined && value !== null) {
          fd.append(key, value);
        }
      });

      mutate(fd);
    },
    [isUpdate, id, service, mutate],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess) {
      glassToast.success(
        data?.message ||
          `Service ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) {
        reset(defaultValues);
      }
    }
    if (isError) {
      glassToast.error(
        error?.response?.data?.message || "Failed to save service",
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

  const categoryOptions = [
    { value: "Frontend Development", label: "Frontend Development" },
    { value: "Backend Development", label: "Backend Development" },
    { value: "Full Stack Development", label: "Full Stack Development" },
    { value: "Web Design", label: "Web Design" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Landing Page Development", label: "Landing Page Development" },
    { value: "E-commerce Development", label: "E-commerce Development" },
    { value: "Portfolio Websites", label: "Portfolio Websites" },
    { value: "Business Websites", label: "Business Websites" },
    { value: "Blog Websites", label: "Blog Websites" },
    { value: "CMS Development", label: "CMS Development" },
    { value: "WordPress Development", label: "WordPress Development" },
    { value: "React.js Development", label: "React.js Development" },
    { value: "Next.js Development", label: "Next.js Development" },
    { value: "Node.js Development", label: "Node.js Development" },
    { value: "Express.js Development", label: "Express.js Development" },
    { value: "API Integration", label: "API Integration" },
    { value: "Website Maintenance", label: "Website Maintenance" },
    { value: "Website Optimization", label: "Website Optimization" },
    { value: "SEO Optimization", label: "SEO Optimization" },
    { value: "Hosting & Deployment", label: "Hosting & Deployment" },
    { value: "Website Security", label: "Website Security" },
    { value: "Custom Web Application", label: "Custom Web Application" },
    { value: "Responsive Design", label: "Responsive Design" },
    { value: "Performance Optimization", label: "Performance Optimization" },
  ];

  const statusOptions = [
    { value: "Published", label: "Published" },
    { value: "Draft", label: "Draft" },
  ];

  return (
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
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isUpdate ? "Edit Service" : "Add Service"}
            </h3>
            <p className="text-slate-400 text-sm">
              {isUpdate
                ? "Update service details"
                : "Add a new service offering"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-full flex flex-col gap-6"
        >
          {/* Title & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Service Title"
              name="title"
              register={register}
              errors={errors}
              placeholder="e.g., Modern Frontend Website Development"
              icon={Briefcase}
            />
            <SelectField
              label="Status"
              name="status"
              register={register}
              errors={errors}
              required={false}
              placeholder="-- Select Status --"
              options={statusOptions}
              icon={CheckCircle2}
            />
          </div>

          {/* Category & Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Category"
              name="category"
              register={register}
              errors={errors}
              required={false}
              placeholder="-- Select Category --"
              options={categoryOptions}
              icon={Layers}
            />
            <FileInputField
              label="Service Image"
              name="serviceImage"
              register={register}
              error={errors["serviceImage"]}
              existingFileUrl={service?.serviceImage?.url || ""}
              required={false}
              accept="image/*"
            />
          </div>

          {/* Description */}
          <TextareaField
            label="Service Description"
            name="shortDesc"
            register={register}
            errors={errors}
            rows={6}
            placeholder="Describe your service, what you offer, and how it benefits clients..."
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
                  {isUpdate ? "Update Service" : "Add Service"}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default memo(ServiceForm);
