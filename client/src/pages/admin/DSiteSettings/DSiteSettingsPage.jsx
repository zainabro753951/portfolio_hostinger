import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  Globe,
  Search,
  Share2,
  Plus,
  Trash2,
  X,
  Loader2,
  Save,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import DSiteSettingsHeader from "./components/DSiteSettingsHeader";
import FormField from "../Components/FormField";
import TextareaField from "../Components/TextAreaField";
import SelectField from "../Components/OptionField";
import FileInputField from "../Components/FileInputField";
import { appendFormData } from "../../../Utils/Utils";
import { useAddSiteSettings } from "../../../Queries/AddSiteSettings";
import { glassToast } from "../Components/ToastMessage";

// ============================================
// SEO PAGE ITEM - ISOLATED COMPONENT (No re-renders from parent)
// ============================================
const SEOPageItem = memo(
  ({
    idx,
    page,
    register,
    errors,
    isExpanded,
    onToggle,
    onDelete,
    watchPageSlug,
    watchMetaTitle,
  }) => {
    // Local state for this item only - doesn't affect parent
    const [localExpanded, setLocalExpanded] = useState(isExpanded);

    useEffect(() => {
      setLocalExpanded(isExpanded);
    }, [isExpanded]);

    const handleToggle = useCallback(() => {
      setLocalExpanded((prev) => !prev);
      onToggle(idx);
    }, [idx, onToggle]);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: -20,
          transition: { duration: 0.2 },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-xl bg-[#0f0f1a]/60 border border-white/[0.06] overflow-hidden"
      >
        {/* SEO Page Header - Collapsible */}
        <div
          className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
          onClick={handleToggle}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-400 text-xs font-bold border border-violet-500/20 flex-shrink-0">
              {idx + 1}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {watchPageSlug || `SEO Page ${idx + 1}`}
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 truncate">
                {watchMetaTitle || "No title set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idx);
              }}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all border border-rose-500/10"
              title="Delete this SEO page"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <motion.div
              animate={{ rotate: localExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-slate-400"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {localExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-5 pt-0 border-t border-white/[0.04]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Page Slug"
                    name={`pageSlug_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="/about, /projects, /contact"
                  />
                  <FormField
                    label="Meta Title"
                    name={`metaTitle_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="About Me | My Portfolio"
                  />
                </div>

                <div className="mt-4">
                  <TextareaField
                    label="Meta Description"
                    name={`metaDescription_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="Brief description for search engines (150-160 characters)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Meta Keywords"
                    name={`metaKeyword_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="portfolio, developer, react, nodejs"
                  />
                  <FormField
                    label="Canonical URL"
                    name={`canonicalURL_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="https://yourdomain.com/page"
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    label="OG Title (Open Graph)"
                    name={`OGTitle_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="Title for social media sharing"
                  />
                </div>

                <div className="mt-4">
                  <TextareaField
                    label="OG Description"
                    name={`OGDescription_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <SelectField
                    label="Twitter Card Type"
                    name={`twitterCardType_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="-- Select Type --"
                    options={[
                      { value: "summary", label: "Summary" },
                      {
                        value: "summary_large_image",
                        label: "Summary Large Image",
                      },
                      { value: "app", label: "App" },
                      { value: "player", label: "Player" },
                    ]}
                  />
                  <SelectField
                    label="Meta Robots"
                    name={`metaRobots_${idx}`}
                    register={register}
                    errors={errors}
                    placeholder="-- Select Directive --"
                    options={[
                      { value: "index, follow", label: "Index, Follow" },
                      { value: "noindex, follow", label: "Noindex, Follow" },
                      { value: "index, nofollow", label: "Index, Nofollow" },
                      {
                        value: "noindex, nofollow",
                        label: "Noindex, Nofollow",
                      },
                    ]}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

SEOPageItem.displayName = "SEOPageItem";

// ============================================
// MAIN COMPONENT
// ============================================
const DSiteSettingsPage = () => {
  const { site_info, seo_pages, contact_info } = useSelector(
    (state) => state.siteSettings,
  );

  // Use refs to prevent unnecessary re-renders
  const [SEOPagesContent, setSEOPagesContent] = useState([]);
  const [deletedSEOPagesIds, setDeletedSEOPagesIds] = useState([]);
  const [expandedSEO, setExpandedSEO] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const initialDataRef = useRef(null);
  const formRef = useRef(null);

  const methods = useForm({
    defaultValues: {
      websiteName: "",
      tagline: "",
      footerText: "",
      googleAnalytics: "",
      linkedinUrl: "",
      githubUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      email: "",
      contactPhone: "",
    },
    mode: "onBlur", // Changed from onChange to onBlur to reduce re-renders
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = methods;

  // Watch ONLY the values needed for SEO headers (not all values)
  // This prevents re-renders on every keystroke
  const watchedSEOValues = useRef({});

  // Update watched values only when needed
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && name.includes("_")) {
        const [field, idx] = name.split("_");
        if (!watchedSEOValues.current[idx]) {
          watchedSEOValues.current[idx] = {};
        }
        watchedSEOValues.current[idx][field] = value[name];
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load SEO Pages - ONLY runs when seo_pages changes from Redux
  useEffect(() => {
    if (seo_pages?.length > 0) {
      const mapped = seo_pages.map((page) => ({
        id: page.id || null,
        isUpdate: !!page.id,
        pageSlug: page.pageSlug || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        metaKeyword: page.metaKeyword || "",
        canonicalURL: page.canonicalURL || "",
        OGTitle: page.OGTitle || "",
        OGDescription: page.OGDescription || "",
        twitterCardType: page.twitterCardType || "",
        metaRobots: page.metaRobots || "",
      }));
      setSEOPagesContent(mapped);
      setExpandedSEO({ 0: true });

      // Pre-populate watched values
      mapped.forEach((page, idx) => {
        watchedSEOValues.current[idx] = {
          pageSlug: page.pageSlug,
          metaTitle: page.metaTitle,
        };
      });
    }
  }, [seo_pages]);

  // Auto-populate form - ONLY runs once when data loads
  useEffect(() => {
    if (!site_info || !contact_info) return;

    const baseValues = {
      websiteName: site_info?.websiteName || "",
      tagline: site_info?.tagline || "",
      footerText: site_info?.footerText || "",
      googleAnalytics: site_info?.googleAnalytics || "",
      linkedinUrl: contact_info?.linkedin || "",
      githubUrl: contact_info?.github || "",
      facebookUrl: contact_info?.facebook || "",
      instagramUrl: contact_info?.instagram || "",
      email: contact_info?.email || "",
      contactPhone: contact_info?.contactPhone || "",
    };

    const seoValues = {};
    seo_pages?.forEach((page, i) => {
      seoValues[`pageSlug_${i}`] = page.pageSlug || "";
      seoValues[`metaTitle_${i}`] = page.metaTitle || "";
      seoValues[`metaDescription_${i}`] = page.metaDescription || "";
      seoValues[`metaKeyword_${i}`] = page.metaKeyword || "";
      seoValues[`canonicalURL_${i}`] = page.canonicalURL || "";
      seoValues[`OGTitle_${i}`] = page.OGTitle || "";
      seoValues[`OGDescription_${i}`] = page.OGDescription || "";
      seoValues[`twitterCardType_${i}`] = page.twitterCardType || "";
      seoValues[`metaRobots_${i}`] = page.metaRobots || "";
    });

    const allValues = { ...baseValues, ...seoValues };
    reset(allValues);
    initialDataRef.current = JSON.parse(JSON.stringify(allValues));
    setSaveStatus("idle");
  }, [site_info, seo_pages, contact_info, reset]);

  // Mutation
  const { mutate, isPending, isSuccess, isError, data, error } =
    useAddSiteSettings();

  // FIXED Submit handler
  const onSubmit = useCallback(
    (formData) => {
      setSaveStatus("saving");

      // Safely get file values
      const logoFile = formData.logoImage || null;
      const faviconFile = formData.favicon || null;

      const formattedData = {
        isUpdate: !!site_info,
        deletedSeoPageIds: deletedSEOPagesIds,
        siteInfo: {
          websiteName: formData.websiteName || "",
          tagline: formData.tagline || "",
          footerText: formData.footerText || "",
          googleAnalytics: formData.googleAnalytics || "",
          logoImage: logoFile,
          favicon: faviconFile,
          logoImageOBJ: site_info?.logoImage || null,
          faviconOBJ: site_info?.favicon || null,
        },
        seoPages: SEOPagesContent.map((page, i) => ({
          id: page.id || null,
          isUpdate: !!page.id,
          pageSlug: formData[`pageSlug_${i}`] || "",
          metaTitle: formData[`metaTitle_${i}`] || "",
          metaDescription: formData[`metaDescription_${i}`] || "",
          metaKeyword: formData[`metaKeyword_${i}`] || "",
          canonicalURL: formData[`canonicalURL_${i}`] || "",
          OGTitle: formData[`OGTitle_${i}`] || "",
          OGDescription: formData[`OGDescription_${i}`] || "",
          twitterCardType: formData[`twitterCardType_${i}`] || "",
          metaRobots: formData[`metaRobots_${i}`] || "",
        })),
        contactInfo: {
          linkedin: formData.linkedinUrl || "",
          github: formData.githubUrl || "",
          facebook: formData.facebookUrl || "",
          instagram: formData.instagramUrl || "",
          email: formData.email || "",
          contactPhone: formData.contactPhone || "",
        },
      };

      const fd = new FormData();
      appendFormData(fd, formattedData);

      mutate(fd, {
        onSuccess: (response) => {
          setSaveStatus("saved");
          setDeletedSEOPagesIds([]);
          initialDataRef.current = JSON.parse(JSON.stringify(getValues()));
          glassToast.success(
            response?.message || "Settings saved successfully!",
          );
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: (err) => {
          setSaveStatus("error");
          glassToast.error(
            err?.response?.data?.message || "Failed to save settings",
          );
        },
      });
    },
    [site_info, SEOPagesContent, deletedSEOPagesIds, mutate, getValues],
  );

  // Handle Reset with confirmation
  const handleReset = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to reset?",
      );
      if (!confirmed) return;
    }
    reset(initialDataRef.current);
    setDeletedSEOPagesIds([]);
    setSEOPagesContent(
      seo_pages?.map((page) => ({
        id: page.id || null,
        isUpdate: !!page.id,
        pageSlug: page.pageSlug || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        metaKeyword: page.metaKeyword || "",
        canonicalURL: page.canonicalURL || "",
        OGTitle: page.OGTitle || "",
        OGDescription: page.OGDescription || "",
        twitterCardType: page.twitterCardType || "",
        metaRobots: page.metaRobots || "",
      })) || [],
    );
    setSaveStatus("idle");
    glassToast.info("Form reset to last saved state");
  }, [isDirty, reset, seo_pages]);

  // Delete SEO Page - OPTIMIZED
  const handleDeleteSEOPage = useCallback(
    (idx) => {
      const deletedPage = SEOPagesContent[idx];
      const updatedSEO = SEOPagesContent.filter((_, i) => i !== idx);
      setSEOPagesContent(updatedSEO);

      if (deletedPage?.id) {
        setDeletedSEOPagesIds((prev) => [...prev, deletedPage.id]);
      }

      const currentValues = getValues();
      const newValues = { ...currentValues };

      // Remove all SEO keys
      Object.keys(newValues).forEach((key) => {
        if (
          key.startsWith("pageSlug_") ||
          key.startsWith("metaTitle_") ||
          key.startsWith("metaDescription_") ||
          key.startsWith("metaKeyword_") ||
          key.startsWith("canonicalURL_") ||
          key.startsWith("OGTitle_") ||
          key.startsWith("OGDescription_") ||
          key.startsWith("twitterCardType_") ||
          key.startsWith("metaRobots_")
        ) {
          delete newValues[key];
        }
      });

      // Re-index remaining SEO pages
      updatedSEO.forEach((page, i) => {
        newValues[`pageSlug_${i}`] = page.pageSlug || "";
        newValues[`metaTitle_${i}`] = page.metaTitle || "";
        newValues[`metaDescription_${i}`] = page.metaDescription || "";
        newValues[`metaKeyword_${i}`] = page.metaKeyword || "";
        newValues[`canonicalURL_${i}`] = page.canonicalURL || "";
        newValues[`OGTitle_${i}`] = page.OGTitle || "";
        newValues[`OGDescription_${i}`] = page.OGDescription || "";
        newValues[`twitterCardType_${i}`] = page.twitterCardType || "";
        newValues[`metaRobots_${i}`] = page.metaRobots || "";
      });

      reset(newValues, { keepValues: false });

      // Update expanded state
      setExpandedSEO((prev) => {
        const newExpanded = {};
        updatedSEO.forEach((_, i) => {
          newExpanded[i] = prev[i] || false;
        });
        return newExpanded;
      });

      // Update watched values ref
      const newWatched = {};
      updatedSEO.forEach((page, i) => {
        newWatched[i] = {
          pageSlug: page.pageSlug,
          metaTitle: page.metaTitle,
        };
      });
      watchedSEOValues.current = newWatched;
    },
    [SEOPagesContent, getValues, reset],
  );

  // Toggle SEO expand/collapse
  const toggleSEOExpand = useCallback((idx) => {
    setExpandedSEO((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  // Add new SEO page
  const handleAddSEOPage = useCallback(() => {
    const newIdx = SEOPagesContent.length;
    setSEOPagesContent((prev) => [...prev, {}]);
    setExpandedSEO((prev) => ({ ...prev, [newIdx]: true }));
    watchedSEOValues.current[newIdx] = { pageSlug: "", metaTitle: "" };
  }, [SEOPagesContent.length]);

  // Clear all SEO pages
  const handleClearAllSEO = useCallback(() => {
    if (SEOPagesContent.length === 0) return;
    const confirmed = window.confirm(
      "Are you sure you want to remove all SEO pages?",
    );
    if (!confirmed) return;

    const newDeletedIds = SEOPagesContent.filter((page) => page.id).map(
      (page) => page.id,
    );
    setDeletedSEOPagesIds((prev) => [...prev, ...newDeletedIds]);
    setSEOPagesContent([]);

    const currentValues = getValues();
    const newValues = { ...currentValues };
    Object.keys(newValues).forEach((key) => {
      if (
        key.startsWith("pageSlug_") ||
        key.startsWith("metaTitle_") ||
        key.startsWith("metaDescription_") ||
        key.startsWith("metaKeyword_") ||
        key.startsWith("canonicalURL_") ||
        key.startsWith("OGTitle_") ||
        key.startsWith("OGDescription_") ||
        key.startsWith("twitterCardType_") ||
        key.startsWith("metaRobots_")
      ) {
        delete newValues[key];
      }
    });
    reset(newValues);
    setExpandedSEO({});
    watchedSEOValues.current = {};
  }, [SEOPagesContent, getValues, reset]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
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

  // Section Card Component
  const SectionCard = useCallback(
    ({ children, title, description, icon: Icon, badge }) => (
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06] relative z-10">
          {Icon && (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-500/10">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {title}
              </h2>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-slate-400 text-sm mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="relative z-10">{children}</div>
      </motion.div>
    ),
    [],
  );

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && saveStatus !== "saved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveStatus]);

  return (
    <FormProvider {...methods}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Header with form ref for submission */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <DSiteSettingsHeader
            handleReset={handleReset}
            isPending={isPending}
            isDirty={isDirty}
            saveStatus={saveStatus}
            onSaveClick={() => formRef.current?.requestSubmit()}
          />
        </motion.div>

        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-8"
        >
          {/* Basic Site Settings */}
          <SectionCard
            title="Basic Site Settings"
            description="Configure your website's core information and branding"
            icon={Globe}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Website Name"
                name="websiteName"
                register={register}
                errors={errors}
                placeholder="My Awesome Portfolio"
              />
              <FormField
                label="Tagline"
                name="tagline"
                register={register}
                errors={errors}
                placeholder="Full Stack Developer & Designer"
              />
              <FormField
                label="Footer Text"
                name="footerText"
                register={register}
                errors={errors}
                placeholder="© 2024 All rights reserved"
              />
              <FormField
                label="Google Analytics ID"
                name="googleAnalytics"
                register={register}
                errors={errors}
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <FileInputField
                label="Logo Image"
                name="logoImage"
                register={register}
                error={errors.logoImage}
                existingFileUrl={site_info?.logoImage?.url || ""}
                required={false}
              />
              <FileInputField
                label="Favicon"
                name="favicon"
                register={register}
                error={errors.favicon}
                existingFileUrl={site_info?.favicon?.url || ""}
                required={false}
              />
            </div>
          </SectionCard>

          {/* SEO Pages */}
          <SectionCard
            title="SEO — Per Page Settings"
            description="Add page-specific SEO metadata for better search visibility"
            icon={Search}
            badge={`${SEOPagesContent.length} page${SEOPagesContent.length !== 1 ? "s" : ""}`}
          >
            <AnimatePresence mode="popLayout">
              {SEOPagesContent.length > 0 ? (
                <div className="space-y-4">
                  {SEOPagesContent.map((item, idx) => (
                    <SEOPageItem
                      key={`seo-${idx}`}
                      idx={idx}
                      page={item}
                      register={register}
                      errors={errors}
                      isExpanded={!!expandedSEO[idx]}
                      onToggle={toggleSEOExpand}
                      onDelete={handleDeleteSEOPage}
                      watchPageSlug={
                        watchedSEOValues.current[idx]?.pageSlug || ""
                      }
                      watchMetaTitle={
                        watchedSEOValues.current[idx]?.metaTitle || ""
                      }
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-slate-400"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Search className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-slate-300">
                    No SEO pages configured yet
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Add SEO pages to improve your search engine visibility
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add/Clear Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleAddSEOPage}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all text-sm relative overflow-hidden group"
              >
                <Plus className="w-4 h-4" />
                Add SEO Page
              </button>

              {SEOPagesContent.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSEO}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </SectionCard>

          {/* Social & Contact */}
          <SectionCard
            title="Social & Contact"
            description="Your social media profiles and contact information"
            icon={Share2}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="LinkedIn URL"
                name="linkedinUrl"
                register={register}
                errors={errors}
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <FormField
                label="GitHub URL"
                name="githubUrl"
                register={register}
                errors={errors}
                placeholder="https://github.com/yourusername"
              />
              <FormField
                label="Facebook URL"
                name="facebookUrl"
                register={register}
                errors={errors}
                placeholder="https://facebook.com/yourpage"
              />
              <FormField
                label="Instagram URL"
                name="instagramUrl"
                register={register}
                errors={errors}
                placeholder="https://instagram.com/yourhandle"
              />
              <FormField
                label="Contact Email"
                name="email"
                register={register}
                errors={errors}
                placeholder="contact@yourdomain.com"
              />
              <FormField
                label="Contact Phone"
                name="contactPhone"
                register={register}
                errors={errors}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </SectionCard>

          {/* Bottom Save Bar */}
          <motion.div
            variants={itemVariants}
            className="sticky bottom-4 z-50 flex items-center justify-end gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-2xl shadow-2xl"
          >
            {isDirty && saveStatus !== "saved" && (
              <span className="flex items-center gap-2 text-amber-400 text-sm mr-auto">
                <AlertTriangle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-2 text-emerald-400 text-sm mr-auto">
                <CheckCircle2 className="w-4 h-4" />
                Saved successfully
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all text-sm font-medium disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all text-sm relative overflow-hidden group"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </FormProvider>
  );
};

export default memo(DSiteSettingsPage);
