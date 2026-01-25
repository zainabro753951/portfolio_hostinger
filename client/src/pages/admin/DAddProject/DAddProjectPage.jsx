// DAddProjectPage.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  FaUpload,
  FaCode,
  FaTags,
  FaFolderOpen,
  FaLink,
  FaGlobe,
  FaTrashAlt,
} from "react-icons/fa";
import DAddProjectHeader from "./components/DAddProjectHeader";
import { useFieldArray, useForm } from "react-hook-form";
import { mutateProject } from "../../../Queries/AddProject";
import { glassToast } from "../Components/ToastMessage";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearProject, projectFindById } from "../../../features/projectSlice";
import RichTextEditor from "../Components/RichText";

const fieldBase =
  "w-full bg-gradient-to-r from-white/6 to-white/3 border border-cyan-400/20 focus:border-cyan-300/70 md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] outline-none text-white placeholder:text-gray-400 backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] transition-shadow duration-200 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[3.1vw] focus:ring-theme-cyan/30 focus:ring-3 md:text-[1vw] sm:text-[2vw] xs:text-[3vw]";

const DAddProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { project, projects } = useSelector((state) => state.projects);

  const [isHeroImageRemoved, setIsHeroImageRemoved] = useState(false);
  const [heroPreviewSrc, setHeroPreviewSrc] = useState(null);
  const [ogPreviewSrc, setOgPreviewSrc] = useState(null);
  const [isOgImageRemoved, setIsOgImageRemoved] = useState(false);
  const [isGalleryRemoved, setIsGalleryRemoved] = useState(false);
  const [output, setOutput] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const defaultValues = {
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
  };

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
  } = useForm({
    defaultValues,
  });

  const heroImage = watch("heroImage");
  const ogProjectImage = watch("ogProjectImage");
  const gallery = watch("gallery");

  // 🔹 Fetch project or reset
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
  }, [id, projects, dispatch]);

  // 🔹 Populate form when project changes
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
  }, [id, project, reset]);

  const isSlugEdited = useRef(false);

  const seoTitle = watch("seoTitle", "");
  const metaDesc = watch("metaDesc", "");
  const title = watch("title", "");

  // 🔹 Hero / OG Preview Logic
  useEffect(() => {
    let heroUrl;
    let ogUrl;

    // Hero Preview
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

    // OG Preview
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

    // Cleanup for both object URLs
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
  ]);

  console.log(ogPreviewSrc);

  // 🔹 Gallery Preview
  const galleryPreview = () => {
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
  };

  const SEO_TITLE_LIMIT = 60;
  const META_DESC_LIMIT = 160;
  const SHORT_DESC_LIMIT = 200;

  // --- Field arrays
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

  // --- Slug helper
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // --- Auto-update slug
  useEffect(() => {
    if (!isSlugEdited.current && title.trim() !== "") {
      setValue("slug", generateSlug(title));
    }
  }, [title, setValue]);

  // --- Chips handlers
  const addTech = (e) => {
    e.preventDefault();
    const input = e.target.form.querySelector("#techInput");
    const value = input.value.trim();
    clearErrors("techStack");
    if (!value)
      return setError("techStack", {
        type: "required",
        message: "Tech is required",
      });
    if (value.length < 2)
      return setError("techStack", {
        type: "minLength",
        message: "Tech must be at least 2 chars",
      });
    if (techFields.some((t) => t.name.toLowerCase() === value.toLowerCase()))
      return setError("techStack", {
        type: "duplicate",
        message: "This tech already exists",
      });
    appendTech({ name: value });
    input.value = "";
  };

  const addTag = (e) => {
    e.preventDefault();
    const input = e.target.form.querySelector("#tagInput");
    const value = input.value.trim();
    clearErrors("tag");
    if (!value)
      return setError("tag", { type: "required", message: "Tag is required" });
    if (value.length < 2)
      return setError("tag", {
        type: "minLength",
        message: "Tag must be at least 2 chars",
      });
    if (tagFields.some((t) => t.name.toLowerCase() === value.toLowerCase()))
      return setError("tag", {
        type: "duplicate",
        message: "This tag already exists",
      });
    appendTag({ name: value });
    input.value = "";
  };

  const addMetaKeyword = (e) => {
    e.preventDefault();
    const input = e.target.form.querySelector("#metaKeywordInput");
    const value = input.value.trim();
    clearErrors("metaKeywords");
    if (!value)
      return setError("metaKeywords", {
        type: "required",
        message: "Meta keyword required",
      });
    if (value.length < 2)
      return setError("metaKeywords", {
        type: "minLength",
        message: "Meta keyword min 2 chars",
      });
    if (
      metaKeywordsFields.some(
        (t) => t.name.toLowerCase() === value.toLowerCase(),
      )
    )
      return setError("metaKeywords", {
        type: "duplicate",
        message: "This meta keyword already exists",
      });
    appendMetaKeywords({ name: value });
    input.value = "";
  };

  // --- Mutation
  const { mutate, isSuccess, isPending, isError, data, error } =
    mutateProject();

  // 🔹 Form Submit
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("shortDesc", data.shortDesc);
    formData.append("content", output || "");
    formData.append("repoLink", data.repoLink || "");
    formData.append("liveDemo", data.liveDemo || "");

    // 🔹 Files
    if (data.heroImage?.[0]) formData.append("heroImage", data.heroImage[0]);
    if (data.ogProjectImage?.[0])
      formData.append("ogProjectImage", data.ogProjectImage[0]);
    Array.from(data.gallery || []).forEach((file) =>
      formData.append("gallery", file),
    );

    // 🔹 Removal Flags
    formData.append("isHeroImageRemoved", JSON.stringify(isHeroImageRemoved));
    formData.append("isOgImageRemoved", JSON.stringify(isOgImageRemoved));
    formData.append("isGalleryRemoved", JSON.stringify(isGalleryRemoved));

    // 🔹 Existing URLs
    formData.append("heroImageOBJ", JSON.stringify(project?.heroImage || null));
    formData.append(
      "ogProjectImageOBJ",
      JSON.stringify(project?.ogProjectImage || null),
    );
    formData.append("galleryOBJS", JSON.stringify(project?.gallery || []));

    // 🔹 Other fields
    formData.append("techStack", JSON.stringify(data.techStack));
    formData.append("tag", JSON.stringify(data.tag));
    formData.append("metaKeywords", JSON.stringify(data.metaKeywords));
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
  };

  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message, "success");
    }
    if (isError) {
      console.log(error);
      glassToast(error?.response?.data?.message, "error");
    }
  }, [isSuccess, isError]);

  // framer variants
  const fadeIn = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45 } },
  };

  return (
    <>
      <motion.form
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="md:p-[1.5vw] sm:p-[2.5vw] xs:p-[3.5vw]"
      >
        <DAddProjectHeader isPending={isPending} />

        {/* FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
          {/* left: main form */}
          <motion.div
            variants={fadeIn}
            className="lg:col-span-2 md:p-[2vw] sm:p-[2.5vw] xs:p-[3vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]"
          >
            {/* Title & slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              <div className="w-full flex flex-col ">
                <label className="flex flex-col">
                  <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    Title
                  </span>
                  <input
                    {...register("title", {
                      required: "Project title is required",
                      minLength: {
                        value: 5,
                        message:
                          "Project title must be at least 5 characters long",
                      },
                    })}
                    placeholder="Project title"
                    className={fieldBase}
                  />
                </label>
                {errors.title && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.title?.message}
                  </span>
                )}
              </div>

              <label className="flex flex-col">
                <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                  Slug
                </span>
                <input
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        "Slug can only contain lowercase letters, numbers, and hyphens (no spaces allowed)",
                    },
                  })}
                  placeholder="project-slug"
                  className={fieldBase}
                />
                <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400 mt-1">
                  Auto-generated from title — editable.
                </small>
                {errors.slug && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.slug?.message}
                  </span>
                )}
              </label>
            </div>

            <label className="flex flex-col">
              <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                Short description
              </span>
              <textarea
                {...register("shortDesc", {
                  required: "Short description is required",
                  minLength: {
                    value: 50,
                    message:
                      "Short description must be at least 50 characters long",
                  },
                  maxLength: {
                    value: SHORT_DESC_LIMIT,
                    message: `Short description cannot exceed ${SHORT_DESC_LIMIT} characters`,
                  },
                })}
                rows={8}
                placeholder="Full project description, case study, details, process..."
                className={fieldBase + " resize-y"}
                // Optional: HTML-level enforcement
                maxLength={SHORT_DESC_LIMIT}
              />
              {errors.shortDesc && (
                <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                  {errors.shortDesc?.message}
                </span>
              )}
            </label>

            {/* Repo + Live Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] ">
              <label className="flex flex-col">
                <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                  Repository (Git)
                </span>
                <div className="relative">
                  <input
                    type="url"
                    {...register("repoLink", {
                      required: "Repository link is required",
                      pattern: {
                        value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                        message:
                          "Please enter a valid URL (e.g. https://github.com/username/repo)",
                      },
                    })}
                    placeholder="https://github.com/you/repo"
                    className={
                      fieldBase + " md:pr-[2.5vw] sm:pr-[3.5vw] xs:pr-[4.5vw]"
                    }
                  />
                  <FaLink className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw]" />
                </div>
                {errors.repoLink && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.repoLink?.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                  Live demo
                </span>
                <div className="relative">
                  <input
                    type="url"
                    {...register("liveDemo")}
                    placeholder="https://your-live-demo.com"
                    className={
                      fieldBase + " md:pr-[2.5vw] sm:pr-[3.5vw] xs:pr-[4.5vw]"
                    }
                  />
                  <FaGlobe className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw]" />
                </div>
              </label>
            </div>

            {/* ================================================ */}
            {/* =============== Rich Text Editor ============== */}
            {/* ================================================ */}
            <RichTextEditor setOutput={setOutput} output={output} />

            {/* Hero image */}
            <div className="bg-white/4 backdrop-blur-md border border-white/10 md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw] md:p-[1.2vw] sm:p-[2.2vw] xs:p-[3.2vw]">
              <div className="flex flex-wrap items-center justify-between md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                <h3 className="font-medium md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]">
                  Hero Image
                </h3>
                <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
                  Recommended 1600×900
                </small>
              </div>

              <div className="flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                {/* Preview */}
                <div className="relative md:h-[15vw] sm:h-[25vw] xs:h-[35vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] overflow-hidden bg-gradient-to-br from-white/6 to-white/3 border border-white/8 flex items-center justify-center">
                  {heroPreviewSrc ? (
                    <img
                      src={
                        heroPreviewSrc // fallback if nothing available
                      }
                      alt="hero preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FaUpload className="mx-auto mb-1 md:text-[2.2vw] sm:text-[3.2vw] xs:text-[5.2vw]" />
                      <div className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw]">
                        No hero image
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload & Remove Buttons */}
                <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    htmlFor="heroImage"
                    onClick={() => {
                      // agar pehle clear kiya gaya tha, ab nayi image add ho rahi hai
                      if (isHeroImageRemoved) setIsHeroImageRemoved(false);
                    }}
                    className="cursor-pointer md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] w-full text-center"
                  >
                    Upload
                  </motion.label>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    type="button"
                    onClick={() => {
                      setHeroPreviewSrc(null); // reset preview to fallback
                      setValue("heroImage", null); // clear the file input
                      setIsHeroImageRemoved(true);
                    }}
                    className="flex items-center justify-center gap-2
             md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw]
             md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw]
             md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]
             bg-white/6 border border-white/8 text-white
             hover:bg-white/8 md:text-[1vw] sm:text-[2vw] xs:text-[4vw]"
                  >
                    <FaTrashAlt className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw]" />
                    Remove
                  </motion.button>
                </div>

                {/* Hidden File Input */}
                <input
                  id="heroImage"
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  {...register("heroImage")}
                  className="hidden"
                />
              </div>
            </div>

            {/*  */}
            {/* Gallery (multiple) */}
            <div className="bg-white/4 backdrop-blur-md border border-white/10 md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw] md:p-[1.2vw] sm:p-[2.2vw] xs:p-[3.2vw]">
              <div className="flex items-center justify-between ">
                <h3 className="font-medium md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]">
                  Gallery
                </h3>
                <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
                  Up to 12 screenshots
                </small>
              </div>

              <div className="flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                {/* ✅ Preview Grid */}
                <div className="grid grid-cols-4 md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                  {galleryPreview().length > 0 ? (
                    galleryPreview().map((src, idx) => (
                      <img
                        key={`gallery-${idx}`}
                        src={src}
                        alt={`gallery-${idx}`}
                        className="w-full md:h-[5vw] sm:h-[10vw] xs:h-[15vw] object-cover md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]"
                      />
                    ))
                  ) : (
                    <div className="col-span-4 text-gray-400 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-center">
                      No screenshots uploaded
                    </div>
                  )}
                </div>

                {/* ✅ Upload + Clear Buttons */}
                <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                  <motion.label
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    htmlFor="gallery"
                    className="cursor-pointer md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-white/6 border border-white/8 text-white hover:bg-white/8 md:text-[1vw] sm:text-[2vw] xs:text-[4vw] w-full text-center rounded-[0.7vw]"
                    onClick={() => {
                      // agar pehle clear kiya gaya tha, ab nayi image add ho rahi hai
                      if (isGalleryRemoved) setIsGalleryRemoved(false);
                    }}
                  >
                    Add Image
                  </motion.label>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    type="button"
                    onClick={() => {
                      setValue("gallery", []);
                      setIsGalleryRemoved(true);
                    }}
                    className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-white/6 border border-white/8 text-white hover:bg-white/8 md:text-[1vw] sm:text-[2vw] xs:text-[4vw] rounded-[0.7vw]"
                  >
                    Clear
                  </motion.button>
                </div>

                {/* ✅ File Input */}
                <input
                  id="gallery"
                  type="file"
                  accept="image/*"
                  name="gallery"
                  multiple
                  {...register("gallery")}
                  className="hidden"
                />

                {/* ✅ Error Message */}
                {errors.gallery && (
                  <p className="text-red-400 md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.6vw] mt-[0.6vw]">
                    {errors.gallery.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              {/* Tech stack */}
              <div className="w-full flex flex-col gap-0.5">
                <div className="bg-white/4 backdrop-blur-md border border-white/10 md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw] md:p-[1.2vw] sm:p-[2.2vw] xs:p-[3.2vw]">
                  <div className="flex flex-wrap items-center justify-between md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                    <h3 className="font-medium md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                      <FaCode /> Tech Stack
                    </h3>
                    <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
                      Press Enter to add
                    </small>
                  </div>

                  <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw] items-center md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    <input
                      id="techInput"
                      placeholder="Add tech (React, Tailwind)"
                      className={fieldBase}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTech(e);
                      }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      onClick={addTech}
                      className="md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
                    >
                      Add
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                    {techFields.map((t, idx) => {
                      return (
                        <span
                          key={idx}
                          className="md:px-[1vw] sm:px-[1.5vw] xs:px-[2vw] md:py-[0.4vw] sm:py-[0.9vw] xs:py-[1.4vw] rounded-full bg-white/6 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-white flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]"
                        >
                          {t.name}
                          <button
                            onClick={() => removeTech(idx)}
                            type="button"
                            className="text-gray-400 hover:text-red-300 ml-2"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
                {errors.techStack && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.techStack.message}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="w-full flex flex-col gap-0.5">
                <div className="bg-white/4 backdrop-blur-md border border-white/10 md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw] md:p-[1.2vw] sm:p-[2.2vw] xs:p-[3.2vw]">
                  <div className="flex flex-wrap items-center justify-between md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                    <h3 className="font-medium md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                      <FaTags /> Tags
                    </h3>
                    <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
                      Press Enter to add
                    </small>
                  </div>

                  <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw] items-center md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    <input
                      id="tagInput"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTag(e);
                      }}
                      placeholder="Add tag (portfolio, ui)"
                      className={fieldBase}
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      onClick={addTag}
                      className="md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
                    >
                      Add
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                    {tagFields.map((t, idx) => (
                      <span
                        key={idx}
                        className="md:px-[1vw] sm:px-[1.5vw] xs:px-[2vw] md:py-[0.4vw] sm:py-[0.9vw] xs:py-[1.4vw] rounded-full bg-white/6 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-white flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]"
                      >
                        {t.name}
                        <button
                          onClick={() => removeTag(idx)}
                          type="button"
                          className="text-gray-400 hover:text-red-300 md:ml-[0.3vw] sm:ml-[0.8vw] xs:ml-[1.3vw]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {errors.tag && (
                  <p className="text-red-400 md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.6vw]">
                    {errors.tag.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* right: settings / SEO / media */}
          <motion.aside
            variants={fadeIn}
            className="md:space-y-[1.5vw] sm:space-y-[2.5vw] xs:space-y-[3.5vw]"
          >
            {/* Category/Status/Visibility */}
            <div
              className="md:p-[2vw] sm:p-[2.5vw] xs:p-[3vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
      backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]"
            >
              <div className="grid grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                <label className="flex flex-col">
                  <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    Category
                  </span>
                  <select
                    {...register("category", { required: true })}
                    className={fieldBase}
                  >
                    <option className="bg-black" value={""}>
                      -- Select Category --
                    </option>
                    <option className="bg-black" value={"ui design"}>
                      UI Design
                    </option>
                    <option className="bg-black" value={"frontend development"}>
                      Frontend Development
                    </option>
                    <option className="bg-black" value={"react projects"}>
                      React Projects
                    </option>
                    <option className="bg-black" value={"open source"}>
                      Open Source
                    </option>
                  </select>
                  {errors.category && (
                    <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                      This field is required
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    Status
                  </span>
                  <select
                    {...register("status", { required: true })}
                    className={fieldBase}
                  >
                    <option className="bg-black" value={""}>
                      -- Select Status --
                    </option>
                    <option className="bg-black" value={"published"}>
                      Published
                    </option>
                    <option className="bg-black" value={"draft"}>
                      Draft
                    </option>
                  </select>
                  {errors.status && (
                    <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                      This field is required
                    </span>
                  )}
                </label>

                <label className="flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                  <input
                    type="checkbox"
                    {...register("featured")}
                    className="md:w-[1vw] md:h-[1vw] sm:w-[2vw] sm:h-[2vw] xs:w-[3.5vw] xs:h-[3.5vw] accent-cyan-400"
                  />
                  <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300">
                    Mark as Featured
                  </span>
                </label>

                <label className="flex flex-col">
                  <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    Visibility
                  </span>
                  <select
                    {...register("visibility", { required: true })}
                    className={fieldBase}
                  >
                    <option className="bg-black" value={""}>
                      -- Select Visibility --
                    </option>
                    <option className="bg-black" value={"public"}>
                      Public
                    </option>
                    <option className="bg-black" value={"unlisted"}>
                      Unlisted
                    </option>
                    <option className="bg-black" value={"private"}>
                      Private
                    </option>
                  </select>
                  {errors.visibility && (
                    <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                      This field is required
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    Estimated time
                  </span>
                  <input
                    type="text"
                    {...register("estTime", {
                      required: "Estimated time is required",
                      pattern: {
                        value: /^[1-9]\d*$/, // only positive integers (no 0 or negative)
                        message: "Estimated time must be a positive integer",
                      },
                    })}
                    placeholder="e.g. 3 days"
                    className={fieldBase}
                  />
                  {errors.estTime && (
                    <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                      {errors.estTime?.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* SEO Section */}
            <div
              className="md:p-[2vw] sm:p-[2.5vw] xs:p-[3vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
      backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]"
            >
              <div className="flex items-center justify-between md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                <h3 className="font-medium md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] flex items-center md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                  <FaFolderOpen /> SEO
                </h3>
                <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
                  Improve search visibility
                </small>
              </div>

              <label className="flex flex-col md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-300 mb-1">
                  SEO Title{" "}
                  <span className="text-gray-400 md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw]">
                    ({seoTitle.length}/{SEO_TITLE_LIMIT})
                  </span>
                </span>
                <input
                  {...register("seoTitle", {
                    required: "Meta title is required",
                    maxLength: {
                      value: SEO_TITLE_LIMIT,
                      message: `Meta title must be between 5 and ${SEO_TITLE_LIMIT} characters`,
                    },
                    minLength: {
                      value: 5,
                      message: `Meta title must be between 5 and ${SEO_TITLE_LIMIT} characters`,
                    },
                  })}
                  placeholder={`SEO title (recommended under ${SEO_TITLE_LIMIT} chars)`}
                  maxLength={SEO_TITLE_LIMIT}
                  className={fieldBase}
                />
                {errors.seoTitle && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.seoTitle?.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-300 mb-1">
                  Meta description{" "}
                  <span className="text-gray-400 md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw]">
                    ({metaDesc.length}/{META_DESC_LIMIT})
                  </span>
                </span>
                <textarea
                  {...register("metaDesc", {
                    required: "Meta description is required",
                    maxLength: {
                      value: META_DESC_LIMIT,
                      message: `Meta description must be between 10 and ${META_DESC_LIMIT} characters`,
                    },
                    minLength: {
                      value: 10,
                      message: `Meta description must be between 10 and ${META_DESC_LIMIT} characters`,
                    },
                  })}
                  maxLength={META_DESC_LIMIT}
                  rows={3}
                  placeholder={`Short meta description (max ${META_DESC_LIMIT} chars)`}
                  className={fieldBase + " resize-none"}
                />
                {errors.metaDesc && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.metaDesc?.message}
                  </span>
                )}
              </label>

              {/* Meta Keywords */}
              <div className="w-full flex flex-col gap-0.5">
                <div className="md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                  <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw] items-center md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    <input
                      id="metaKeywordInput"
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addMetaKeyword(e);
                      }}
                      placeholder="Add meta keyword and press Enter"
                      className={fieldBase}
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      onClick={addMetaKeyword}
                      className="md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                    {metaKeywordsFields.map((k, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/6 rounded-full md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-white flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw] items-center"
                      >
                        {k.name}{" "}
                        <button
                          onClick={() => removeMetaKeywords(idx)}
                          type="button"
                          className="text-gray-400 hover:text-red-300 md:ml-[0.3vw] sm:ml-[0.8vw] xs:ml-[1.3vw]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {errors.metaKeywords && (
                  <p className="text-red-400 md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.6vw]">
                    {errors.metaKeywords.message}
                  </p>
                )}
              </div>

              <label className="flex flex-wrap flex-col md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-300 mb-1">
                  Canonical URL
                </span>
                <input
                  type="url"
                  {...register("canonicalUrl", {
                    required: "Canonical url is required",
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/\w .-]*)*\/?$/,
                      message: "Canonical URL must be a valid URL",
                    },
                  })}
                  placeholder="https://yourdomain.com/projects/slug"
                  className={fieldBase}
                />
                {errors.canonicalUrl && (
                  <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
                    {errors.canonicalUrl?.message}
                  </span>
                )}
              </label>

              <div className="w-full flex flex-col gap-0.5">
                <div className="md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
                  <div className="flex flex-wrap items-center justify-between md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw]">
                    <span className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300">
                      Open Graph Image
                    </span>
                    <small className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
                      Used when sharing on social
                    </small>
                  </div>
                  <div className="relative md:h-[15vw] sm:h-[25vw] xs:h-[35vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] overflow-hidden bg-white/6 border border-white/8 md:mb-[0.7vw] sm:mb-[1.7vw] xs:mb-[2.7vw] flex items-center justify-center">
                    {ogPreviewSrc ? (
                      <img
                        src={ogPreviewSrc}
                        alt="OG preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <FaUpload className="mx-auto mb-1 md:text-[2.2vw] sm:text-[3.2vw] xs:text-[5.2vw]" />
                        <div className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw]">
                          No OG image
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex md:gap-[0.9vw] sm:gap-[1.4vw] xs:gap-[1.9vw]">
                    <motion.label
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      htmlFor="ogProjectImage"
                      onClick={() => {
                        // agar pehle clear kiya gaya tha, ab nayi image add ho rahi hai
                        if (isOgImageRemoved) setIsOgImageRemoved(false);
                      }}
                      className="md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
                    >
                      Upload Og
                    </motion.label>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      onClick={() => {
                        setValue("ogProjectImage", null);
                        setOgPreviewSrc(null);
                        setIsOgImageRemoved(true);
                      }}
                      className="md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
                    >
                      Remove Og
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
            </div>
          </motion.aside>
        </div>
      </motion.form>
    </>
  );
};

export default DAddProjectPage;
