import React, { memo, useEffect, useState, useCallback, useRef } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useWatch,
} from "react-hook-form";
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
  Clock,
  Star,
  Search,
  Link as LinkIcon,
  Settings2,
  Globe,
  Code2,
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
import useScrollToRef from "@/hooks/useScrollToRef";
import { safeParse } from "../../../../Utils/Utils";
import FormSection from "../../Components/FormSection";
import ChipInput from "../../Components/ChipInput";

const ServiceForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { service } = useSelector((state) => state.service);
  const [isUpdate, setIsUpdate] = useState(false);
  const updateServiceRef = useRef(null);
  const serviceImage = safeParse(service?.serviceImage);

  const defaultValues = {
    title: "",
    slug: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    techStack: [],
    features: [],
    deliveryTime: "",
    status: "draft",
    isFeatured: false,
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoKeywords: [],
  };

  const methods = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
  } = methods;

  // Field arrays
  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({ control, name: "techStack" });

  const {
    fields: featuresField,
    append: appendFeatures,
    remove: removeFeatures,
  } = useFieldArray({ control, name: "features" });

  const {
    fields: seoKeywordsField,
    append: appendSeoKeywords,
    remove: removeSeoKeywords,
  } = useFieldArray({ control, name: "seoKeywords" });

  // Auto-generate slug from title
  const watchTitle = useWatch({ control, name: "title" });
  useEffect(() => {
    if (watchTitle && !isUpdate) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
      setValue("slug", slug, { shouldValidate: false });
    }
  }, [watchTitle, isUpdate, setValue]);

  // ── FIXED: addChip receives (value, inputElement) ──────────────
  const addChip = useCallback(
    (value, inputElement, fieldName, fields, append, minLength = 2) => {
      const trimmedValue = value.trim();

      clearErrors(fieldName);

      if (!trimmedValue) {
        setError(fieldName, {
          type: "required",
          message: `${fieldName} is required`,
        });
        return;
      }
      if (trimmedValue.length < minLength) {
        setError(fieldName, {
          type: "minLength",
          message: `${fieldName} must be at least ${minLength} chars`,
        });
        return;
      }
      // ✅ FIXED: Check f.name || f.value for both structures
      if (
        fields.some(
          (f) =>
            (f.name || f.value || "").toLowerCase() ===
            trimmedValue.toLowerCase(),
        )
      ) {
        setError(fieldName, {
          type: "duplicate",
          message: `This ${fieldName} already exists`,
        });
        return;
      }

      append({ name: trimmedValue });
      if (inputElement) {
        inputElement.value = "";
        inputElement.focus();
      }
    },
    [clearErrors, setError],
  );

  // Fetch service for edit
  useEffect(() => {
    if (!id) {
      dispatch(clearService());
      reset(defaultValues);
      setIsUpdate(false);
      return;
    }
    dispatch(serviceFindById(Number(id)));
  }, [id, dispatch, reset]);

  // Populate form when data arrives
  useEffect(() => {
    if (!id || !service) return;
    if (service.id !== Number(id)) return;

    reset({
      title: service.title || "",
      slug: service.slug || "",
      category: service.category || "",
      shortDescription: service.shortDescription || "",
      fullDescription: service.fullDescription || "",
      techStack:
        safeParse(service.techStack)?.map((val) => ({ name: val })) || [],
      features:
        safeParse(service.features)?.map((val) => ({ name: val })) || [],
      deliveryTime: service.deliveryTime || "",
      status: service.status || "draft",
      isFeatured: service.isFeatured || false,
      seoMetaTitle: service.seoMetaTitle || "",
      seoMetaDescription: service.seoMetaDescription || "",
      seoKeywords:
        safeParse(service.seoKeywords)?.map((val) => ({ name: val })) || [],
    });

    setIsUpdate(true);
  }, [id, service, reset]);

  useScrollToRef(updateServiceRef, [id], { block: "nearest" }, !!id);

  // ── Updated chip handlers ──────────────────────────────────────
  const addTech = useCallback(
    (value, inputElement) => {
      addChip(value, inputElement, "techStack", techFields, appendTech);
    },
    [addChip, techFields, appendTech],
  );

  const addFeatures = useCallback(
    (value, inputElement) => {
      addChip(value, inputElement, "features", featuresField, appendFeatures);
    },
    [addChip, featuresField, appendFeatures],
  );

  const addSeoKeywords = useCallback(
    (value, inputElement) => {
      addChip(
        value,
        inputElement,
        "seoKeywords",
        seoKeywordsField,
        appendSeoKeywords,
      );
    },
    [addChip, seoKeywordsField, appendSeoKeywords],
  );

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    error,
    data,
    reset: resetMutation,
  } = useAddServices();

  const onSubmit = useCallback(
    (formData) => {
      const fd = new FormData();

      fd.append("isUpdate", isUpdate);
      fd.append("serviceId", isUpdate ? id : "");
      fd.append(
        "serviceImageOBJ",
        isUpdate && serviceImage ? JSON.stringify(serviceImage) : "",
      );

      if (formData.serviceImage instanceof File) {
        fd.append("serviceImage", formData.serviceImage);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "serviceImage") return;
        if (["techStack", "features", "seoKeywords"].includes(key)) return;

        if (value !== undefined && value !== null) {
          if (typeof value === "boolean")
            fd.append(key, value ? "true" : "false");
          else fd.append(key, String(value));
        }
      });

      const techStackValues = formData.techStack.map(
        (item) => item.name || item.value,
      );
      const featuresValues = formData.features.map(
        (item) => item.name || item.value,
      );
      const keywordsValues = formData.seoKeywords.map(
        (item) => item.name || item.value,
      );

      fd.append("techStack", JSON.stringify(techStackValues));
      fd.append("features", JSON.stringify(featuresValues));
      fd.append("seoKeywords", JSON.stringify(keywordsValues));

      mutate(fd);
    },
    [isUpdate, id, serviceImage, mutate],
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const categoryOptions = [
    { value: "Frontend Development", label: "Frontend Development" },
    { value: "Backend Development", label: "Backend Development" },
    { value: "Full-Stack Web App", label: "Full-Stack Web App" },
    {
      value: "API Development & Integration",
      label: "API Development & Integration",
    },
    {
      value: "Database Design & Optimization",
      label: "Database Design & Optimization",
    },
    { value: "DevOps & Deployment", label: "DevOps & Deployment" },
    { value: "Maintenance & Support", label: "Maintenance & Support" },
    { value: "Technical Consultation", label: "Technical Consultation" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // ✅ FIXED: Toast effect with mutation reset
  useEffect(() => {
    if (isSuccess) {
      glassToast.success(
        data?.message ||
          `Service ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) reset(defaultValues);

      // ✅ CRITICAL: Reset mutation state so toast doesn't fire again
      resetMutation();
    }
    if (isError) {
      console.log(error?.response);
      glassToast.error(
        error?.response?.data?.message || "Failed to save service",
      );
      // ✅ Also reset on error to prevent repeated error toasts
      resetMutation();
    }
  }, [isError, isSuccess, data, isUpdate, error, reset, resetMutation]);

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
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isUpdate ? "Edit Service" : "Add New Service"}
              </h3>
              <p className="text-slate-400 text-sm">
                Manage service details, tech stack, and SEO settings.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            ref={updateServiceRef}
            className="w-full flex flex-col gap-8"
          >
            {/* Section: General Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings2 size={18} className="text-cyan-400" /> General
                Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Service Title"
                  name="title"
                  register={register}
                  errors={errors}
                  placeholder="e.g., MERN Stack Development"
                  icon={Briefcase}
                />
                <FormField
                  label="Slug"
                  name="slug"
                  register={register}
                  errors={errors}
                  placeholder="auto-generated"
                  icon={LinkIcon}
                />
                <SelectField
                  label="Category"
                  name="category"
                  register={register}
                  errors={errors}
                  options={categoryOptions}
                  icon={Layers}
                />
                <FormField
                  label="Delivery Time"
                  name="deliveryTime"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 2-3 Weeks"
                  icon={Clock}
                />
              </div>
            </div>

            {/* Section: Content & Tech Stack */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText size={18} className="text-cyan-400" /> Content & Tech
                Stack
              </h4>
              <TextareaField
                label="Short Description"
                name="shortDescription"
                register={register}
                errors={errors}
                rows={3}
                placeholder="Brief overview for cards/grids (max 300 chars)"
                icon={FileText}
              />
              <TextareaField
                label="Full Description"
                name="fullDescription"
                register={register}
                errors={errors}
                rows={8}
                placeholder="Detailed description (Markdown/HTML supported)..."
                icon={FileText}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSection title="Tech Stack" icon={Code2}>
                  <ChipInput
                    fields={techFields}
                    append={appendTech}
                    remove={removeTech}
                    inputId="techInput"
                    placeholder="React, Tailwind CSS..."
                    onAdd={addTech}
                    error={errors.techStack}
                    icon={Code2}
                    label="Technologies"
                  />
                </FormSection>
                <FormSection title="Key Features" icon={Code2}>
                  <ChipInput
                    fields={featuresField}
                    append={appendFeatures}
                    remove={removeFeatures}
                    inputId="featureInput"
                    placeholder="e.g., SEO Optimized"
                    onAdd={addFeatures}
                    error={errors.features}
                    icon={CheckCircle2}
                    label="Key Features"
                  />
                </FormSection>
              </div>
            </div>

            {/* Section: Media */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-cyan-400" /> Media Assets
              </h4>
              <FileInputField
                label="Service Cover Image"
                name="serviceImage"
                error={errors["serviceImage"]}
                existingFileUrl={serviceImage?.url || ""}
                accept="image/*"
              />
            </div>

            {/* Section: SEO */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe size={18} className="text-cyan-400" /> SEO Optimization
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  label="Meta Title"
                  name="seoMetaTitle"
                  register={register}
                  errors={errors}
                  placeholder="Title for search engines (max 60 chars)"
                />
                <TextareaField
                  label="Meta Description"
                  name="seoMetaDescription"
                  register={register}
                  errors={errors}
                  rows={2}
                  placeholder="Description for search engines (max 160 chars)"
                />
                <ChipInput
                  fields={seoKeywordsField}
                  append={appendSeoKeywords}
                  remove={removeSeoKeywords}
                  inputId="seoKeywordsInput"
                  placeholder="e.g., mern, web dev"
                  onAdd={addSeoKeywords}
                  error={errors.seoKeywords}
                  icon={Search}
                  label="SEO Keywords"
                />
              </div>
            </div>

            {/* Section: Status & Settings */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings2 size={18} className="text-cyan-400" /> Status &
                Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Status"
                  name="status"
                  register={register}
                  errors={errors}
                  options={statusOptions}
                  icon={CheckCircle2}
                />
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    {...register("isFeatured")}
                    className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="flex items-center gap-2 text-slate-300 cursor-pointer"
                  >
                    <Star size={16} className="text-yellow-500" /> Featured
                    Service
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full flex items-center justify-end pt-4 border-t border-white/5 mt-4">
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={
                  prefersReducedMotion || isPending ? {} : { scale: 1.02 }
                }
                whileTap={isPending ? {} : { scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isUpdate ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isUpdate ? "Update Service" : "Publish Service"}
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

export default memo(ServiceForm);
