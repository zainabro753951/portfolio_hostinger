import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "motion/react";

import {
  Globe,
  Search,
  Share2,
  Plus,
  Trash2,
  Loader2,
  Save,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  FormProvider,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";

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
// HELPERS
// ============================================

const EMPTY_SEO_PAGE = {
  id: null,
  pageSlug: "",
  metaTitle: "",
  metaDescription: "",
  metaKeyword: "",
  canonicalURL: "",
  OGTitle: "",
  OGDescription: "",
  twitterCardType: "summary_large_image",
  metaRobots: "index, follow",
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const getNestedValue = (object, path) => {
  return path.split(".").reduce((value, key) => value?.[key], object);
};

// FormField components may access errors using errors[name].
// This helper preserves compatibility with nested React Hook Form fields.
const getFieldErrors = (errors, name) => ({
  [name]: getNestedValue(errors, name),
});

const normalizeSeoPage = (page = {}) => ({
  id: page.id || null,
  pageSlug: page.pageSlug || "",
  metaTitle: page.metaTitle || "",
  metaDescription: page.metaDescription || "",
  metaKeyword: page.metaKeyword || "",
  canonicalURL: page.canonicalURL || "",
  OGTitle: page.OGTitle || "",
  OGDescription: page.OGDescription || "",
  twitterCardType: page.twitterCardType || "summary_large_image",
  metaRobots: page.metaRobots || "index, follow",
});

// ============================================
// SECTION CARD
// ============================================

const SectionCard = memo(
  ({ children, title, description, icon: Icon, badge }) => (
    <motion.div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-violet-500/5 to-transparent blur-3xl" />

      <div className="relative z-10 mb-6 flex items-center gap-3 border-b border-white/[0.06] pb-4">
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>

            {badge && (
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-0.5 text-sm text-slate-400">{description}</p>
          )}
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  ),
);

SectionCard.displayName = "SectionCard";

// ============================================
// SEO PAGE ITEM
// ============================================

const SEOPageItem = memo(
  ({
    index,
    fieldKey,
    register,
    control,
    errors,
    onDelete,
    isExpanded,
    onToggle,
  }) => {
    const pageSlug = useWatch({
      control,
      name: `seoPages.${index}.pageSlug`,
    });

    const metaTitle = useWatch({
      control,
      name: `seoPages.${index}.metaTitle`,
    });

    const fieldName = (field) => `seoPages.${index}.${field}`;

    const getErrors = (field) => getFieldErrors(errors, fieldName(field));

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f0f1a]/60"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle();
            }
          }}
          className="flex cursor-pointer select-none items-center justify-between gap-3 p-4 transition-colors hover:bg-white/[0.02] sm:p-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-xs font-bold text-violet-400">
              {index + 1}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">
                {pageSlug || `SEO Page ${index + 1}`}
              </h3>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {metaTitle || "No title set"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="rounded-lg border border-rose-500/10 bg-rose-500/10 p-2 text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
              title="Delete this SEO page"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-400"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key={fieldKey}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.04] p-4 pt-0 sm:p-5">
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Page Slug"
                    name={fieldName("pageSlug")}
                    register={register}
                    errors={getErrors("pageSlug")}
                    placeholder="/about"
                  />

                  <FormField
                    label="Meta Title"
                    name={fieldName("metaTitle")}
                    register={register}
                    errors={getErrors("metaTitle")}
                    placeholder="About Zain Abro | Full-Stack Developer"
                  />
                </div>

                <div className="mt-4">
                  <TextareaField
                    label="Meta Description"
                    name={fieldName("metaDescription")}
                    register={register}
                    errors={getErrors("metaDescription")}
                    placeholder="Write a unique page description..."
                    rows={3}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Meta Keywords"
                    name={fieldName("metaKeyword")}
                    register={register}
                    errors={getErrors("metaKeyword")}
                    placeholder="full stack developer, react developer"
                  />

                  <FormField
                    label="Canonical URL"
                    name={fieldName("canonicalURL")}
                    register={register}
                    errors={getErrors("canonicalURL")}
                    placeholder="https://www.zaincode.io/about"
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    label="OG Title"
                    name={fieldName("OGTitle")}
                    register={register}
                    errors={getErrors("OGTitle")}
                    placeholder="Title for social sharing"
                  />
                </div>

                <div className="mt-4">
                  <TextareaField
                    label="OG Description"
                    name={fieldName("OGDescription")}
                    register={register}
                    errors={getErrors("OGDescription")}
                    placeholder="Description for social sharing"
                    rows={3}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Twitter Card Type"
                    name={fieldName("twitterCardType")}
                    register={register}
                    errors={getErrors("twitterCardType")}
                    options={[
                      { value: "summary", label: "Summary" },
                      {
                        value: "summary_large_image",
                        label: "Summary Large Image",
                      },
                    ]}
                  />

                  <SelectField
                    label="Meta Robots"
                    name={fieldName("metaRobots")}
                    register={register}
                    errors={getErrors("metaRobots")}
                    options={[
                      { value: "index, follow", label: "Index, Follow" },
                      {
                        value: "noindex, follow",
                        label: "Noindex, Follow",
                      },
                      {
                        value: "index, nofollow",
                        label: "Index, Nofollow",
                      },
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

  const [deletedSeoPageIds, setDeletedSeoPageIds] = useState([]);
  const [expandedSEO, setExpandedSEO] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle");

  const initialDataRef = useRef(null);
  const expandNextRef = useRef(false);
  const hydratedRef = useRef(false);
  const formRef = useRef(null);

  const methods = useForm({
    mode: "onBlur",
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
      seoPages: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors, isDirty },
  } = methods;

  const {
    fields: seoFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "seoPages",
    keyName: "fieldKey",
  });

  useEffect(() => {
    if (!seoFields.length) return;

    if (expandNextRef.current || Object.keys(expandedSEO).length === 0) {
      const lastField = seoFields[seoFields.length - 1];

      setExpandedSEO({
        [lastField.fieldKey]: true,
      });

      expandNextRef.current = false;
    }
  }, [seoFields, expandedSEO]);

  const { mutate, isPending } = useAddSiteSettings();

  // ============================================
  // INITIAL DATA HYDRATION
  // ============================================

  useEffect(() => {
    if (hydratedRef.current || !site_info || !contact_info) {
      return;
    }

    const initialValues = {
      websiteName: site_info.websiteName || "",
      tagline: site_info.tagline || "",
      footerText: site_info.footerText || "",
      googleAnalytics: site_info.googleAnalytics || "",

      linkedinUrl: contact_info.linkedin || "",
      githubUrl: contact_info.github || "",
      facebookUrl: contact_info.facebook || "",
      instagramUrl: contact_info.instagram || "",
      email: contact_info.email || "",
      contactPhone: contact_info.contactPhone || "",

      seoPages: (seo_pages || []).map(normalizeSeoPage),
    };

    reset(initialValues);

    initialDataRef.current = cloneData(initialValues);
    hydratedRef.current = true;
  }, [site_info, contact_info, seo_pages, reset]);

  // ============================================
  // ADD SEO PAGE
  // ============================================

  const handleAddSEOPage = useCallback(() => {
    expandNextRef.current = true;
    append({ ...EMPTY_SEO_PAGE });
  }, [append]);

  // ============================================
  // DELETE SEO PAGE
  // ============================================

  const handleDeleteSEOPage = useCallback(
    (index) => {
      const page = getValues(`seoPages.${index}`);

      if (page?.id) {
        setDeletedSeoPageIds((previous) =>
          previous.includes(page.id) ? previous : [...previous, page.id],
        );
      }

      remove(index);

      setExpandedSEO({});
    },
    [getValues, remove],
  );

  // ============================================
  // CLEAR ALL SEO PAGES
  // ============================================

  const handleClearAllSEO = useCallback(() => {
    const currentPages = getValues("seoPages") || [];

    if (currentPages.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove all SEO pages?",
    );

    if (!confirmed) return;

    const idsToDelete = currentPages.map((page) => page.id).filter(Boolean);

    setDeletedSeoPageIds((previous) => [
      ...new Set([...previous, ...idsToDelete]),
    ]);

    replace([]);
    setExpandedSEO({});
  }, [getValues, replace]);

  // ============================================
  // EXPAND / COLLAPSE
  // ============================================

  const toggleSEOExpand = useCallback((fieldKey) => {
    setExpandedSEO((previous) => ({
      ...previous,
      [fieldKey]: !previous[fieldKey],
    }));
  }, []);

  // ============================================
  // RESET FORM
  // ============================================

  const handleReset = useCallback(() => {
    if (!initialDataRef.current) {
      glassToast.error("Settings data has not loaded yet.");
      return;
    }

    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to reset?",
      );

      if (!confirmed) return;
    }

    reset(cloneData(initialDataRef.current));
    setDeletedSeoPageIds([]);
    setExpandedSEO({});
    setSaveStatus("idle");

    glassToast.info("Form reset to last saved state.");
  }, [isDirty, reset]);

  // ============================================
  // SUBMIT
  // ============================================

  const onSubmit = useCallback(
    (formData) => {
      if (isPending) return;

      setSaveStatus("saving");

      const formattedData = {
        isUpdate: !!site_info,

        deletedSeoPageIds: [...new Set(deletedSeoPageIds)],

        siteInfo: {
          websiteName: formData.websiteName || "",
          tagline: formData.tagline || "",
          footerText: formData.footerText || "",
          googleAnalytics: formData.googleAnalytics || "",

          logoImage: formData.logoImage || null,
          favicon: formData.favicon || null,

          logoImageOBJ: site_info?.logoImage || null,
          faviconOBJ: site_info?.favicon || null,
        },

        seoPages: (formData.seoPages || []).map((page) => ({
          id: page.id || null,
          pageSlug: page.pageSlug?.trim() || "",
          metaTitle: page.metaTitle || "",
          metaDescription: page.metaDescription || "",
          metaKeyword: page.metaKeyword || "",
          canonicalURL: page.canonicalURL || "",
          OGTitle: page.OGTitle || "",
          OGDescription: page.OGDescription || "",
          twitterCardType: page.twitterCardType || "summary_large_image",
          metaRobots: page.metaRobots || "index, follow",
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

      const formDataToSend = new FormData();
      appendFormData(formDataToSend, formattedData);

      mutate(formDataToSend, {
        onSuccess: (response) => {
          // Mark current values as the new saved state.
          const savedValues = cloneData(getValues());

          reset(savedValues);
          initialDataRef.current = savedValues;

          setDeletedSeoPageIds([]);
          setSaveStatus("saved");

          glassToast.success(
            response?.message || "Settings saved successfully!",
          );
        },

        onError: (error) => {
          setSaveStatus("error");

          glassToast.error(
            error?.response?.data?.message || "Failed to save settings.",
          );
        },
      });
    },
    [isPending, site_info, deletedSeoPageIds, mutate, getValues, reset],
  );

  // ============================================
  // UNSAVED CHANGES WARNING
  // ============================================

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty && saveStatus !== "saved") {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, saveStatus]);

  // ============================================
  // ANIMATION
  // ============================================

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <FormProvider {...methods}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
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
          {/* BASIC SITE SETTINGS */}

          <SectionCard
            title="Basic Site Settings"
            description="Configure your website's core information and branding."
            icon={Globe}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Website Name"
                name="websiteName"
                register={register}
                errors={errors}
                placeholder="Zaincode"
              />

              <FormField
                label="Tagline"
                name="tagline"
                register={register}
                errors={errors}
                placeholder="Full-Stack Web Developer"
              />

              <FormField
                label="Footer Text"
                name="footerText"
                register={register}
                errors={errors}
                placeholder="© 2026 Zaincode. All rights reserved."
              />

              <FormField
                label="Google Analytics ID"
                name="googleAnalytics"
                register={register}
                errors={errors}
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
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

          {/* SEO PAGES */}

          <SectionCard
            title="SEO — Per Page Settings"
            description="Manage unique metadata for every website page."
            icon={Search}
            badge={`${seoFields.length} page${seoFields.length !== 1 ? "s" : ""}`}
          >
            <AnimatePresence mode="popLayout">
              {seoFields.length > 0 ? (
                <div className="space-y-4">
                  {seoFields.map((field, index) => (
                    <SEOPageItem
                      key={field.fieldKey}
                      fieldKey={field.fieldKey}
                      index={index}
                      register={register}
                      control={control}
                      errors={errors}
                      isExpanded={!!expandedSEO[field.fieldKey]}
                      onToggle={() => toggleSEOExpand(field.fieldKey)}
                      onDelete={() => handleDeleteSEOPage(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-slate-800/50">
                    <Search className="h-8 w-8 opacity-50" />
                  </div>

                  <p className="text-lg font-medium text-slate-300">
                    No SEO pages configured
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a page to configure its search engine metadata.
                  </p>
                </div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAddSEOPage}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
              >
                <Plus className="h-4 w-4" />
                Add SEO Page
              </button>

              {seoFields.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSEO}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </SectionCard>

          {/* SOCIAL & CONTACT */}

          <SectionCard
            title="Social & Contact"
            description="Your social media profiles and contact information."
            icon={Share2}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                placeholder="contact@zaincode.io"
              />

              <FormField
                label="Contact Phone"
                name="contactPhone"
                register={register}
                errors={errors}
                placeholder="+92..."
              />
            </div>
          </SectionCard>

          {/* SAVE BAR */}

          <motion.div
            variants={itemVariants}
            className="sticky bottom-4 z-50 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-4 shadow-2xl backdrop-blur-2xl"
          >
            {isDirty && saveStatus !== "saved" && (
              <span className="mr-auto flex items-center gap-2 text-sm text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Unsaved changes
              </span>
            )}

            {saveStatus === "saved" && (
              <span className="mr-auto flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Saved successfully
              </span>
            )}

            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/60 hover:text-white disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
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
