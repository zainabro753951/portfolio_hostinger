import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Upload,
  Link,
  Globe,
  Trash2,
  Code2,
  Tags,
  FolderOpen,
  FileText,
  Image,
  Plus,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DAddProjectHeader from "./components/DAddProjectHeader";
import { mutateProject } from "../../../Queries/AddProject";
import { glassToast } from "../Components/ToastMessage";
import { clearProject, projectFindById } from "../../../features/projectSlice";
import RichTextEditor from "../Components/RichText";

// Form field base classes - converted from template literal to object
const fieldClasses = {
  base: "w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300",
  focus: "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
  hover: "hover:border-white/20 hover:bg-slate-800/70",
};

const fieldBase = `${fieldClasses.base} ${fieldClasses.focus} ${fieldClasses.hover}`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
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

// Form section component
const FormSection = memo(({ children, title, icon: Icon, className = "" }) => (
  <motion.div
    variants={itemVariants}
    className={`rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 ${className}`}
  >
    {(title || Icon) && (
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Icon className="w-5 h-5" />
          </div>
        )}
        {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      </div>
    )}
    {children}
  </motion.div>
));

FormSection.displayName = "FormSection";

// Chip input component
const ChipInput = memo(
  ({
    fields,
    append,
    remove,
    inputId,
    placeholder,
    onAdd,
    error,
    icon: Icon,
    label,
  }) => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          placeholder={placeholder}
          className={fieldBase}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(e);
            }
          }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          type="button"
          className="px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white hover:bg-slate-700/50 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </motion.button>
      </div>
      {error && (
        <p className="text-rose-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {fields.map((field, idx) => (
          <span
            key={field.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20"
          >
            {field.name}
            <button
              onClick={() => remove(idx)}
              type="button"
              className="text-cyan-400/60 hover:text-rose-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  ),
);

ChipInput.displayName = "ChipInput";

// Image upload section component
const ImageUploadSection = memo(
  ({
    previewSrc,
    onRemove,
    inputId,
    registerName,
    register,
    setValue,
    isRemoved,
    setIsRemoved,
    title,
    recommendedSize,
  }) => {
    const handleUploadClick = useCallback(() => {
      if (isRemoved) setIsRemoved(false);
    }, [isRemoved, setIsRemoved]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white">{title}</h4>
          <small className="text-slate-500 text-xs">{recommendedSize}</small>
        </div>

        <div className="relative h-48 rounded-xl overflow-hidden bg-slate-800/30 border border-white/10 flex items-center justify-center">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt={title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-center text-slate-500">
              <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image uploaded</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            htmlFor={inputId}
            onClick={handleUploadClick}
            className="flex-1 cursor-pointer py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm text-center shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
          >
            Upload
          </motion.label>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onRemove}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/50 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </motion.button>
        </div>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          {...register(registerName)}
        />
      </div>
    );
  },
);

ImageUploadSection.displayName = "ImageUploadSection";

const DAddProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { project, projects } = useSelector((state) => state.projects);

  // State
  const [isHeroImageRemoved, setIsHeroImageRemoved] = useState(false);
  const [heroPreviewSrc, setHeroPreviewSrc] = useState(null);
  const [ogPreviewSrc, setOgPreviewSrc] = useState(null);
  const [isOgImageRemoved, setIsOgImageRemoved] = useState(false);
  const [isGalleryRemoved, setIsGalleryRemoved] = useState(false);
  const [output, setOutput] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const isSlugEdited = useRef(false);

  // Constants
  const SEO_TITLE_LIMIT = 60;
  const META_DESC_LIMIT = 160;
  const SHORT_DESC_LIMIT = 200;

  // Default form values
  const defaultValues = useMemo(
    () => ({
      title: "",
      slug: "",
      shortDesc: "",
      repoLink: "",
      liveDemo: "",
      category: "",
      status: "draft",
      featured: false,
      visibility: "public",
      estTime: "",
      seoTitle: "",
      metaDesc: "",
      canonicalUrl: "",
      techStack: [],
      tag: [],
      metaKeywords: [],
      heroImage: null,
      ogProjectImage: null,
      gallery: [],
    }),
    [],
  );

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues });

  // Watch fields
  const heroImage = watch("heroImage");
  const ogProjectImage = watch("ogProjectImage");
  const gallery = watch("gallery");
  const seoTitle = watch("seoTitle", "");
  const metaDesc = watch("metaDesc", "");
  const title = watch("title", "");

  // Field arrays
  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control,
    name: "techStack",
  });
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tag",
  });
  const {
    fields: metaKeywordsFields,
    append: appendMetaKeywords,
    remove: removeMetaKeywords,
  } = useFieldArray({
    control,
    name: "metaKeywords",
  });

  // Fetch project effect
  useEffect(() => {
    if (id && projects.length > 0) {
      dispatch(projectFindById(Number(id)));
    } else {
      dispatch(clearProject());
      reset(defaultValues);
      setHeroPreviewSrc(null);
      setOgPreviewSrc(null);
      setOutput(null);
      setIsHeroImageRemoved(false);
      setIsOgImageRemoved(false);
      setIsGalleryRemoved(false);
    }
  }, [id, projects, dispatch, reset, defaultValues]);

  // Populate form effect
  useEffect(() => {
    if (id && project?.id === Number(id)) {
      reset({
        ...defaultValues,
        ...project,
        heroImage: null,
        ogProjectImage: null,
        gallery: [],
      });
      setOutput(project?.content || null);
      setHeroPreviewSrc(
        project?.heroImage?.url
          ? `${backendUrl}/${project.heroImage.url.replace(/^\/+/, "")}`
          : null,
      );
      setOgPreviewSrc(
        project?.ogProjectImage?.url
          ? `${backendUrl}/${project.ogProjectImage.url.replace(/^\/+/, "")}`
          : null,
      );
      setIsHeroImageRemoved(false);
      setIsOgImageRemoved(false);
      setIsGalleryRemoved(false);
    }
  }, [id, project, reset, defaultValues, backendUrl]);

  // Image preview effect
  useEffect(() => {
    let heroUrl, ogUrl;

    if (heroImage?.length > 0) {
      heroUrl = URL.createObjectURL(heroImage[0]);
      setHeroPreviewSrc(heroUrl);
    } else if (!isHeroImageRemoved && project?.heroImage?.url) {
      setHeroPreviewSrc(
        `${backendUrl}/${project.heroImage.url.replace(/^\/+/, "")}`,
      );
    } else {
      setHeroPreviewSrc(null);
    }

    if (ogProjectImage?.length > 0) {
      ogUrl = URL.createObjectURL(ogProjectImage[0]);
      setOgPreviewSrc(ogUrl);
    } else if (!isOgImageRemoved && project?.ogProjectImage?.url) {
      setOgPreviewSrc(
        `${backendUrl}/${project.ogProjectImage.url.replace(/^\/+/, "")}`,
      );
    } else {
      setOgPreviewSrc(null);
    }

    return () => {
      if (heroUrl) URL.revokeObjectURL(heroUrl);
      if (ogUrl) URL.revokeObjectURL(ogUrl);
    };
  }, [
    heroImage,
    ogProjectImage,
    isHeroImageRemoved,
    isOgImageRemoved,
    project,
    backendUrl,
  ]);

  // Auto-generate slug
  useEffect(() => {
    if (!isSlugEdited.current && title.trim() !== "") {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  }, [title, setValue]);

  // Handlers
  const addChip = useCallback(
    (e, inputId, fields, append, fieldName, minLength = 2) => {
      e.preventDefault();
      const input = e.target.form?.querySelector(`#${inputId}`) || e.target;
      const value = input.value.trim();

      clearErrors(fieldName);

      if (!value) {
        setError(fieldName, {
          type: "required",
          message: `${fieldName} is required`,
        });
        return;
      }
      if (value.length < minLength) {
        setError(fieldName, {
          type: "minLength",
          message: `${fieldName} must be at least ${minLength} chars`,
        });
        return;
      }
      if (fields.some((f) => f.name.toLowerCase() === value.toLowerCase())) {
        setError(fieldName, {
          type: "duplicate",
          message: `This ${fieldName} already exists`,
        });
        return;
      }

      append({ name: value });
      input.value = "";
    },
    [clearErrors, setError],
  );

  const addTech = useCallback(
    (e) => {
      addChip(e, "techInput", techFields, appendTech, "techStack");
    },
    [addChip, techFields, appendTech],
  );

  const addTag = useCallback(
    (e) => {
      addChip(e, "tagInput", tagFields, appendTag, "tag");
    },
    [addChip, tagFields, appendTag],
  );

  const addMetaKeyword = useCallback(
    (e) => {
      addChip(
        e,
        "metaKeywordInput",
        metaKeywordsFields,
        appendMetaKeywords,
        "metaKeywords",
      );
    },
    [addChip, metaKeywordsFields, appendMetaKeywords],
  );

  // Gallery preview
  const galleryPreview = useMemo(() => {
    if (isGalleryRemoved) return [];
    if (gallery?.length > 0) {
      return Array.from(gallery).map((file) =>
        file instanceof File ? URL.createObjectURL(file) : file,
      );
    }
    if (project?.gallery?.length > 0) {
      return project.gallery.map(
        (g) => `${backendUrl}/${g.url.replace(/^\/+/, "")}`,
      );
    }
    return [];
  }, [gallery, isGalleryRemoved, project, backendUrl]);

  // Mutation
  const { mutate, isSuccess, isPending, isError, data, error } =
    mutateProject();

  // Submit handler
  const onSubmit = useCallback(
    (data) => {
      const formData = new FormData();

      // Append basic fields
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("shortDesc", data.shortDesc);
      formData.append("content", output || "");
      formData.append("repoLink", data.repoLink || "");
      formData.append("liveDemo", data.liveDemo || "");

      // Files
      if (data.heroImage?.[0]) formData.append("heroImage", data.heroImage[0]);
      if (data.ogProjectImage?.[0])
        formData.append("ogProjectImage", data.ogProjectImage[0]);
      Array.from(data.gallery || []).forEach((file) =>
        formData.append("gallery", file),
      );

      // Flags
      formData.append("isHeroImageRemoved", JSON.stringify(isHeroImageRemoved));
      formData.append("isOgImageRemoved", JSON.stringify(isOgImageRemoved));
      formData.append("isGalleryRemoved", JSON.stringify(isGalleryRemoved));

      // Existing data
      formData.append(
        "heroImageOBJ",
        JSON.stringify(project?.heroImage || null),
      );
      formData.append(
        "ogProjectImageOBJ",
        JSON.stringify(project?.ogProjectImage || null),
      );
      formData.append("galleryOBJS", JSON.stringify(project?.gallery || []));

      // Arrays
      formData.append("techStack", JSON.stringify(data.techStack));
      formData.append("tag", JSON.stringify(data.tag));
      formData.append("metaKeywords", JSON.stringify(data.metaKeywords));

      // Other fields
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("featured", data.featured);
      formData.append("visibility", data.visibility);
      formData.append("estTime", data.estTime);
      formData.append("seoTitle", data.seoTitle);
      formData.append("metaDesc", data.metaDesc);
      formData.append("canonicalUrl", data.canonicalUrl);
      formData.append("projectId", project?.id || "");

      mutate(formData);
    },
    [
      output,
      isHeroImageRemoved,
      isOgImageRemoved,
      isGalleryRemoved,
      project,
      mutate,
    ],
  );

  // Toast effects
  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message, "success");
    }
    if (isError) {
      glassToast(
        error?.response?.data?.message || "An error occurred",
        "error",
      );
    }
  }, [isSuccess, isError, data, error]);

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto"
    >
      <DAddProjectHeader isPending={isPending} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <FormSection title="Basic Information" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Project Title
                </label>
                <input
                  {...register("title", {
                    required: "Project title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                  placeholder="Enter project title"
                  className={fieldBase}
                />
                {errors.title && (
                  <p className="text-rose-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Slug
                </label>
                <input
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: "Only lowercase letters, numbers, and hyphens",
                    },
                  })}
                  placeholder="project-slug"
                  className={fieldBase}
                />
                <small className="text-slate-500 text-xs">
                  Auto-generated from title
                </small>
                {errors.slug && (
                  <p className="text-rose-400 text-xs">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium text-slate-300">
                Short Description
              </label>
              <textarea
                {...register("shortDesc", {
                  required: "Short description is required",
                  minLength: { value: 50, message: "Minimum 50 characters" },
                  maxLength: {
                    value: SHORT_DESC_LIMIT,
                    message: `Maximum ${SHORT_DESC_LIMIT} characters`,
                  },
                })}
                rows={4}
                placeholder="Brief project description..."
                className={`${fieldBase} resize-y`}
                maxLength={SHORT_DESC_LIMIT}
              />
              {errors.shortDesc && (
                <p className="text-rose-400 text-xs">
                  {errors.shortDesc.message}
                </p>
              )}
            </div>
          </FormSection>

          <FormSection title="Links" icon={Link}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Link className="w-4 h-4 text-slate-500" />
                  Repository URL
                </label>
                <input
                  type="url"
                  {...register("repoLink", {
                    required: "Repository link is required",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Must be a valid URL",
                    },
                  })}
                  placeholder="https://github.com/username/repo"
                  className={fieldBase}
                />
                {errors.repoLink && (
                  <p className="text-rose-400 text-xs">
                    {errors.repoLink.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  Live Demo
                </label>
                <input
                  type="url"
                  {...register("liveDemo")}
                  placeholder="https://your-demo.com"
                  className={fieldBase}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Content" icon={FileText}>
            <RichTextEditor setOutput={setOutput} output={output} />
          </FormSection>

          <FormSection title="Hero Image" icon={Image}>
            <ImageUploadSection
              previewSrc={heroPreviewSrc}
              onRemove={() => {
                setHeroPreviewSrc(null);
                setValue("heroImage", null);
                setIsHeroImageRemoved(true);
              }}
              inputId="heroImage"
              registerName="heroImage"
              register={register}
              setValue={setValue}
              isRemoved={isHeroImageRemoved}
              setIsRemoved={setIsHeroImageRemoved}
              title="Hero Image"
              recommendedSize="Recommended: 1600×900"
            />
          </FormSection>

          <FormSection title="Gallery" icon={Image}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryPreview.length > 0 ? (
                  galleryPreview.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden bg-slate-800/30"
                    >
                      <img
                        src={src}
                        alt={`Gallery ${idx}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-slate-500">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No gallery images</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  htmlFor="gallery"
                  onClick={() => isGalleryRemoved && setIsGalleryRemoved(false)}
                  className="flex-1 cursor-pointer py-2.5 px-4 rounded-xl bg-slate-800/50 border border-white/10 text-white text-center text-sm font-medium hover:bg-slate-700/50 transition-colors"
                >
                  Add Images
                </motion.label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setValue("gallery", []);
                    setIsGalleryRemoved(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800/50 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                >
                  Clear All
                </motion.button>
              </div>
              <input
                id="gallery"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                {...register("gallery")}
              />
            </div>
          </FormSection>

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

            <FormSection title="Tags" icon={Tags}>
              <ChipInput
                fields={tagFields}
                append={appendTag}
                remove={removeTag}
                inputId="tagInput"
                placeholder="portfolio, ui..."
                onAdd={addTag}
                error={errors.tag}
                icon={Tags}
                label="Tags"
              />
            </FormSection>
          </div>
        </div>

        {/* Right Column - Settings & SEO */}
        <div className="space-y-6">
          <FormSection title="Project Settings" icon={FolderOpen}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Category
                </label>
                <select
                  {...register("category", { required: true })}
                  className={fieldBase}
                >
                  <option value="">Select Category</option>
                  <option value="ui design">UI Design</option>
                  <option value="frontend development">
                    Frontend Development
                  </option>
                  <option value="react projects">React Projects</option>
                  <option value="open source">Open Source</option>
                </select>
                {errors.category && (
                  <p className="text-rose-400 text-xs">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Status
                </label>
                <select
                  {...register("status", { required: true })}
                  className={fieldBase}
                >
                  <option value="">Select Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                {errors.status && (
                  <p className="text-rose-400 text-xs">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Visibility
                </label>
                <select
                  {...register("visibility", { required: true })}
                  className={fieldBase}
                >
                  <option value="">Select Visibility</option>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
                {errors.visibility && (
                  <p className="text-rose-400 text-xs">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Estimated Time
                </label>
                <input
                  {...register("estTime", {
                    required: "Required",
                    pattern: {
                      value: /^[1-9]\d*$/,
                      message: "Positive integer only",
                    },
                  })}
                  placeholder="e.g. 3 days"
                  className={fieldBase}
                />
                {errors.estTime && (
                  <p className="text-rose-400 text-xs">
                    {errors.estTime.message}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700"
                />
                <span className="text-sm text-slate-300">Mark as Featured</span>
              </label>
            </div>
          </FormSection>

          <FormSection title="SEO Settings" icon={FolderOpen}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  SEO Title{" "}
                  <span className="text-slate-500">
                    ({seoTitle.length}/{SEO_TITLE_LIMIT})
                  </span>
                </label>
                <input
                  {...register("seoTitle", {
                    required: "Required",
                    minLength: { value: 5, message: "Min 5 chars" },
                    maxLength: {
                      value: SEO_TITLE_LIMIT,
                      message: `Max ${SEO_TITLE_LIMIT} chars`,
                    },
                  })}
                  placeholder="SEO Title"
                  maxLength={SEO_TITLE_LIMIT}
                  className={fieldBase}
                />
                {errors.seoTitle && (
                  <p className="text-rose-400 text-xs">
                    {errors.seoTitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Meta Description{" "}
                  <span className="text-slate-500">
                    ({metaDesc.length}/{META_DESC_LIMIT})
                  </span>
                </label>
                <textarea
                  {...register("metaDesc", {
                    required: "Required",
                    minLength: { value: 10, message: "Min 10 chars" },
                    maxLength: {
                      value: META_DESC_LIMIT,
                      message: `Max ${META_DESC_LIMIT} chars`,
                    },
                  })}
                  rows={3}
                  placeholder="Meta description..."
                  maxLength={META_DESC_LIMIT}
                  className={`${fieldBase} resize-none`}
                />
                {errors.metaDesc && (
                  <p className="text-rose-400 text-xs">
                    {errors.metaDesc.message}
                  </p>
                )}
              </div>

              <ChipInput
                fields={metaKeywordsFields}
                append={appendMetaKeywords}
                remove={removeMetaKeywords}
                inputId="metaKeywordInput"
                placeholder="Add keyword..."
                onAdd={addMetaKeyword}
                error={errors.metaKeywords}
                label="Meta Keywords"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Canonical URL
                </label>
                <input
                  type="url"
                  {...register("canonicalUrl", {
                    required: "Required",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Valid URL required",
                    },
                  })}
                  placeholder="https://yoursite.com/project"
                  className={fieldBase}
                />
                {errors.canonicalUrl && (
                  <p className="text-rose-400 text-xs">
                    {errors.canonicalUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  OG Image
                </label>
                <div className="relative h-32 rounded-xl overflow-hidden bg-slate-800/30 border border-white/10 flex items-center justify-center">
                  {ogPreviewSrc ? (
                    <img
                      src={ogPreviewSrc}
                      alt="OG Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-center text-slate-500">
                      <Upload className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">No OG image</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    htmlFor="ogProjectImage"
                    onClick={() =>
                      isOgImageRemoved && setIsOgImageRemoved(false)
                    }
                    className="flex-1 cursor-pointer py-2 px-3 rounded-lg bg-slate-800/50 border border-white/10 text-white text-center text-xs hover:bg-slate-700/50 transition-colors"
                  >
                    Upload OG
                  </motion.label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setValue("ogProjectImage", null);
                      setOgPreviewSrc(null);
                      setIsOgImageRemoved(true);
                    }}
                    className="py-2 px-3 rounded-lg bg-slate-800/50 border border-white/10 text-slate-400 hover:text-rose-400 text-xs"
                  >
                    Remove
                  </motion.button>
                </div>
                <input
                  id="ogProjectImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("ogProjectImage")}
                />
              </div>
            </div>
          </FormSection>
        </div>
      </div>
    </motion.form>
  );
};

export default memo(DAddProjectPage);
