import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "motion/react";
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
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import DSiteSettingsHeader from "./components/DSiteSettingsHeader";
import FormField from "../Components/FormField";
import TextareaField from "../Components/TextAreaField";
import SelectField from "../Components/OptionField";
import FileInputField from "../Components/FileInputField";
import { appendFormData } from "../../../Utils/Utils";
import { useAddSiteSettings } from "../../../Queries/AddSiteSettings";
import { glassToast } from "../Components/ToastMessage";

const DSiteSettingsPage = () => {
  const { site_info, seo_pages, contact_info } = useSelector(
    (state) => state.siteSettings,
  );
  const [SEOPagesContent, setSEOPagesContent] = useState([]);
  const [deletedSEOPagesIds, setDeletedSEOPagesIds] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
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
  });

  // Load SEO Pages
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
    }
  }, [seo_pages]);

  // Auto-populate form
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

    reset({ ...baseValues, ...seoValues });
  }, [site_info, seo_pages, contact_info, reset]);

  // Mutation
  const { mutate, isPending, isSuccess, isError, data, error } =
    useAddSiteSettings();

  // Submit handler
  const onSubmit = useCallback(
    (formData) => {
      const formattedData = {
        isUpdate: !!site_info,
        deletedSeoPageIds: deletedSEOPagesIds,
        siteInfo: {
          websiteName: formData.websiteName,
          tagline: formData.tagline,
          footerText: formData.footerText,
          googleAnalytics: formData.googleAnalytics,
          logoImage: formData.logoImage?.[0],
          favicon: formData.favicon?.[0],
          logoImageOBJ: site_info?.logoImage,
          faviconOBJ: site_info?.favicon,
        },
        seoPages: SEOPagesContent.map((page, i) => ({
          id: page.id || null,
          isUpdate: !!page.id,
          pageSlug: formData[`pageSlug_${i}`],
          metaTitle: formData[`metaTitle_${i}`],
          metaDescription: formData[`metaDescription_${i}`],
          metaKeyword: formData[`metaKeyword_${i}`],
          canonicalURL: formData[`canonicalURL_${i}`],
          OGTitle: formData[`OGTitle_${i}`],
          OGDescription: formData[`OGDescription_${i}`],
          twitterCardType: formData[`twitterCardType_${i}`],
          metaRobots: formData[`metaRobots_${i}`],
        })),
        contactInfo: {
          linkedin: formData.linkedinUrl,
          github: formData.githubUrl,
          facebook: formData.facebookUrl,
          instagram: formData.instagramUrl,
          email: formData.email,
          contactPhone: formData.contactPhone,
        },
      };

      const fd = new FormData();
      appendFormData(fd, formattedData);
      mutate(fd);
    },
    [site_info, SEOPagesContent, deletedSEOPagesIds, mutate],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess && data) {
      glassToast.success(data?.message || "Settings saved successfully!");
    }
    if (isError && error) {
      glassToast.error(
        error?.response?.data?.message || "Failed to save settings",
      );
    }
  }, [isSuccess, isError, data, error]);

  // Delete SEO Page
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

      reset(newValues);
    },
    [SEOPagesContent, getValues, reset],
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Section Card Component
  const SectionCard = ({ children, title, description, icon: Icon }) => (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          {description && (
            <p className="text-slate-400 text-sm mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
        <DSiteSettingsHeader isPending={isPending} />
      </motion.div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-8"
      >
        {/* Basic Site Settings */}
        <SectionCard
          title="Basic Site Settings"
          description="Configure your website's basic information"
          icon={Settings}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4">
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
        >
          {SEOPagesContent.length > 0 ? (
            <div className="space-y-6">
              {SEOPagesContent.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative rounded-xl bg-slate-800/40 border border-white/10 p-5 sm:p-6"
                >
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSEOPage(idx)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                    title="Delete this SEO page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No SEO pages configured yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Add SEO pages to improve your search engine visibility
              </p>
            </div>
          )}

          {/* Add/Clear Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSEOPagesContent((p) => [...p, {}])}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add SEO Page
            </motion.button>

            {SEOPagesContent.length > 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSEOPagesContent([])}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
                Clear All
              </motion.button>
            )}
          </div>
        </SectionCard>

        {/* Social & Contact */}
        <SectionCard
          title="Social & Contact"
          description="Your social media profiles and contact information"
          icon={Share2}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
      </form>
    </motion.div>
  );
};

export default memo(DSiteSettingsPage);
