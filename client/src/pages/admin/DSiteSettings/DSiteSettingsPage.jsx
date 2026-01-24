import { motion } from 'motion/react'
import DSiteSettingsHeader from './components/DSiteSettingsHeader'
import { useForm } from 'react-hook-form'
import FormField from '../Components/FormField'
import { useEffect, useState } from 'react'
import { appendFormData } from '../../../Utils/Utils'
import { useAddSiteSettings } from '../../../Queries/AddSiteSettings'
import { glassToast } from '../Components/ToastMessage'
import { useSelector } from 'react-redux'
import TextareaField from '../Components/TextAreaField'
import SelectField from '../Components/OptionField'
import FileInputField from '../Components/FileInputField'
import { IoTrashOutline } from 'react-icons/io5'

const glassClass = `
  w-full bg-gradient-to-br from-[#0a0a2a]/70 to-[#101040]/40
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_30px_rgba(34,211,238,0.25)]
  md:p-[2vw] sm:p-[3vw] xs:p-[4vw]
  md:rounded-[1.5vw] sm:rounded-[2.5vw] xs:rounded-[3.5vw]
`

const fieldBase = `
  w-full bg-gradient-to-r from-white/5 to-white/10
  border border-cyan-400/20 focus:border-cyan-300/60
  md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw]
  outline-none text-white placeholder:text-gray-400
  backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw]
  md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
  transition-all duration-200 ease-in-out
  focus:ring-2 focus:ring-cyan-400/30 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]
  md:placeholder:text-[1vw] xs:placeholder:text-[2vw] xs:placeholder:text-[4vw] md:text-[1vw] sm:text-[2vw] xs:text-[3vw]
`

const DSiteSettingsPage = () => {
  const { site_info, seo_pages, contact_info } = useSelector(state => state.siteSettings)
  const [SEOPagesContent, setSEOPagesContent] = useState([])
  const [deletedSEOPagesIds, setDeletedSEOPagesIds] = useState([])

  // 🧠 React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      websiteName: '',
      tagline: '',
      footerText: '',
      googleAnalytics: '',
      linkedinUrl: '',
      githubUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      email: '',
      contactPhone: '',
    },
  })

  // 🧩 Load SEO Pages initially
  useEffect(() => {
    if (seo_pages && seo_pages.length > 0) {
      const mapped = seo_pages.map(page => ({
        id: page.id || null, // 👈 keep id for updates
        isUpdate: !!page.id, // 👈 backend will use this flag
        pageSlug: page.pageSlug || '',
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        metaKeyword: page.metaKeyword || '',
        canonicalURL: page.canonicalURL || '',
        OGTitle: page.OGTitle || '',
        OGDescription: page.OGDescription || '',
        twitterCardType: page.twitterCardType || '',
        metaRobots: page.metaRobots || '',
      }))
      setSEOPagesContent(mapped)
    }
  }, [seo_pages])

  // ♻️ Auto-populate form when backend data arrives
  useEffect(() => {
    if (!site_info || !contact_info) return

    const baseValues = {
      websiteName: site_info?.websiteName || '',
      tagline: site_info?.tagline || '',
      footerText: site_info?.footerText || '',
      googleAnalytics: site_info?.googleAnalytics || '',
      linkedinUrl: contact_info?.linkedin || '',
      githubUrl: contact_info?.github || '',
      facebookUrl: contact_info?.facebook || '',
      instagramUrl: contact_info?.instagram || '',
      email: contact_info?.email || '',
      contactPhone: contact_info?.contactPhone || '',
    }

    const seoValues = {}
    seo_pages?.forEach((page, i) => {
      seoValues[`pageSlug_${i}`] = page.pageSlug || ''
      seoValues[`metaTitle_${i}`] = page.metaTitle || ''
      seoValues[`metaDescription_${i}`] = page.metaDescription || ''
      seoValues[`metaKeyword_${i}`] = page.metaKeyword || ''
      seoValues[`canonicalURL_${i}`] = page.canonicalURL || ''
      seoValues[`OGTitle_${i}`] = page.OGTitle || ''
      seoValues[`OGDescription_${i}`] = page.OGDescription || ''
      seoValues[`twitterCardType_${i}`] = page.twitterCardType || ''
      seoValues[`metaRobots_${i}`] = page.metaRobots || ''
    })

    // ✅ Properly sync all values with RHF (prevents validation glitch)
    reset({ ...baseValues, ...seoValues })
  }, [site_info, seo_pages, contact_info, reset])

  // 📦 Mutation Hook
  const { mutate, isPending, isSuccess, isError, data, error } = useAddSiteSettings()

  // 📝 On Submit
  const onSubmit = formData => {
    const formattedData = {
      isUpdate: !!site_info, // 👈 tell backend whether to insert or update
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
    }

    const fd = new FormData()
    appendFormData(fd, formattedData)
    mutate(fd)
  }

  // 🧾 Handle success/error toast
  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message, 'success')
    }
    if (isError) {
      glassToast(error?.response?.data?.message, 'error')
    }
  }, [isSuccess, isError, data, error])

  // 🗑 Delete SEO Page Safely
  const handleDeleteSEOPage = idx => {
    // ✅ Get the page being deleted
    const deletedPage = SEOPagesContent[idx]

    // ✅ Step 1: Create updated SEO list
    const updatedSEO = SEOPagesContent.filter((_, i) => i !== idx)
    setSEOPagesContent(updatedSEO)

    // ✅ Step 2: Track deleted page IDs (only if it exists in DB)
    if (deletedPage?.id) {
      setDeletedSEOPagesIds(prev => [...prev, deletedPage.id])
    }

    // ✅ Step 3: Rebuild all field values with correct new indexes
    const currentValues = getValues()
    const newValues = { ...currentValues }

    // ✅ Step 4: Remove all old SEO fields
    Object.keys(newValues).forEach(key => {
      if (
        key.startsWith('pageSlug_') ||
        key.startsWith('metaTitle_') ||
        key.startsWith('metaDescription_') ||
        key.startsWith('metaKeyword_') ||
        key.startsWith('canonicalURL_') ||
        key.startsWith('OGTitle_') ||
        key.startsWith('OGDescription_') ||
        key.startsWith('twitterCardType_') ||
        key.startsWith('metaRobots_')
      ) {
        delete newValues[key]
      }
    })

    // ✅ Step 5: Reassign correct keys for remaining pages
    updatedSEO.forEach((page, i) => {
      newValues[`pageSlug_${i}`] = page.pageSlug || ''
      newValues[`metaTitle_${i}`] = page.metaTitle || ''
      newValues[`metaDescription_${i}`] = page.metaDescription || ''
      newValues[`metaKeyword_${i}`] = page.metaKeyword || ''
      newValues[`canonicalURL_${i}`] = page.canonicalURL || ''
      newValues[`OGTitle_${i}`] = page.OGTitle || ''
      newValues[`OGDescription_${i}`] = page.OGDescription || ''
      newValues[`twitterCardType_${i}`] = page.twitterCardType || ''
      newValues[`metaRobots_${i}`] = page.metaRobots || ''
    })

    // ✅ Step 6: Reset the form cleanly
    reset(newValues)
  }

  console.log(site_info?.logoImage)

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] space-y-[2vw]"
      >
        {/* Site Setting Header */}
        <DSiteSettingsHeader isPending={isPending} />
        {/* Site Settings form */}

        <div className="w-full flex flex-col md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={glassClass}
          >
            <h3 className="text-white font-semibold md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] tracking-wide mb-[1vw]">
              Basic Site Settings
            </h3>

            <div className="w-full flex flex-col md:gap-[1.2vw] sm:gap-[2.2vw] xs:gap-[3.2vw]">
              {/* Row 1 */}
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                <FormField
                  label="Website Name"
                  name="websiteName"
                  register={register}
                  errors={errors}
                  placeholder="Website Name"
                />
                <FormField
                  label="Tagline"
                  name="tagline"
                  register={register}
                  errors={errors}
                  placeholder="Tagline"
                />
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                <FormField
                  label="Footer Text"
                  name="footerText"
                  register={register}
                  errors={errors}
                  placeholder="Footer Text"
                />
                <FormField
                  label="Google Analytics / Tracking ID"
                  name="googleAnalytics"
                  register={register}
                  errors={errors}
                  placeholder="Google Analytics / Tracking ID"
                />
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                <FileInputField
                  label="Logo Image"
                  name="logoImage"
                  register={register}
                  error={errors['logoImage']}
                  existingFileUrl={site_info?.logoImage?.url || ''}
                  required={false}
                  fieldBase={fieldBase}
                />

                <FileInputField
                  label="Favicon"
                  name="favicon"
                  register={register}
                  error={errors['favicon']}
                  required={false}
                  existingFileUrl={site_info?.favicon?.url || ''}
                  fieldBase={fieldBase}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={glassClass}
          >
            <div>
              <h3 className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw] font-semibold">
                SEO — Per Page Settings
              </h3>
              <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400">
                Add page-specific SEO title & description. These entries will be used when rendering
                specific pages.
              </p>
            </div>

            {/* ===================  Add SEO Pages Hidden ====================== */}

            {SEOPagesContent?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw] md:p-[2vw] sm:p-[2.5vw] xs:p-[3vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full flex md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] flex-col"
                >
                  <div className="w-full md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] flex justify-end">
                    <span
                      onClick={() => handleDeleteSEOPage(idx)}
                      title={idx}
                      className="md:text-[1.8vw] sm:text-[2.5vw] xs:text-[3.5vw] text-red-400 text-shadow-sm text-shadow-red-400"
                    >
                      <IoTrashOutline />
                    </span>
                  </div>
                  <div className="w-full flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] ">
                    {/* Row 1 */}
                    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                      <FormField
                        label="Page Name / Slug"
                        name={`pageSlug_${idx}`}
                        register={register}
                        errors={errors}
                        placeholder="e.g /about /project"
                      />

                      <FormField
                        label="Meta Title"
                        name={`metaTitle_${idx}`}
                        register={register}
                        errors={errors}
                        placeholder="Meta Title"
                      />
                    </div>

                    {/* Row 2 */}

                    <TextareaField
                      label="Meta Description"
                      name={`metaDescription_${idx}`}
                      register={register}
                      errors={errors}
                      placeholder="Describe your coursework, achievements, or focus areas..."
                    />

                    {/* Row 3 */}
                    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                      <FormField
                        label="Meta Keyword"
                        name={`metaKeyword_${idx}`}
                        register={register}
                        errors={errors}
                        placeholder="frontend, developer, portfolio"
                      />

                      <FormField
                        label="Canonical URL"
                        name={`canonicalURL_${idx}`}
                        register={register}
                        errors={errors}
                        placeholder="https://yourwebsite.com/about"
                      />
                    </div>
                    {/* Row 4 */}
                    <FormField
                      label="OG Title (Open Graph)"
                      name={`OGTitle_${idx}`}
                      register={register}
                      errors={errors}
                      placeholder="OG Title (Open Graph)"
                    />
                    {/* Row 5 */}
                    <TextareaField
                      label="OG Description"
                      name={`OGDescription_${idx}`}
                      register={register}
                      errors={errors}
                      placeholder="Enter your og description for SEO purpose..."
                    />
                    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                      <SelectField
                        label="Twitter Card Type"
                        name={`twitterCardType_${idx}`}
                        register={register}
                        errors={errors}
                        required={true}
                        placeholder="-- Select Twitter Card Type --"
                        options={[
                          { value: 'summary', label: 'summary' },
                          { value: 'summary_large_image', label: 'summary_large_image' },
                          { value: 'app', label: 'app' },
                          { value: 'player', label: 'player' },
                        ]}
                      />

                      <SelectField
                        label="Meta Robots"
                        name={`metaRobots_${idx}`}
                        register={register}
                        errors={errors}
                        required={true}
                        placeholder="-- Select Meta Robots --"
                        options={[
                          { value: 'index, follow', label: 'index, follow' },
                          { value: 'noindex, follow', label: 'noindex, follow' },
                          { value: 'index, nofollow', label: 'index, nofollow' },
                          { value: 'noindex, nofollow', label: 'noindex, nofollow' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex md:md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] items-center md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSEOPagesContent(p => [...p, {}])
                }}
                type="button"
                className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] "
              >
                Add SEO Page
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={() => {
                  setSEOPagesContent([])
                }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw]"
              >
                Clear All
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={glassClass}
          >
            <h3 className="text-white font-semibold md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] tracking-wide mb-[1vw]">
              Social & Contact
            </h3>

            <div className=" flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
              <div className=" w-full grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
                <FormField
                  label={'Linkedin Url'}
                  name={'linkedinUrl'}
                  register={register}
                  required={false}
                  errors={errors}
                  placeholder="https://linkedin.com"
                />
                <FormField
                  label={'Github Url'}
                  name={'githubUrl'}
                  register={register}
                  required={false}
                  errors={errors}
                  placeholder="https://github.com"
                />
              </div>
              <div className=" w-full grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
                <FormField
                  label={'Facebook Url'}
                  name={'facebookUrl'}
                  register={register}
                  required={false}
                  errors={errors}
                  placeholder="https://facebook.com"
                />
                <FormField
                  label={'Instagram Url'}
                  name={'instagramUrl'}
                  register={register}
                  required={false}
                  errors={errors}
                  placeholder="https://instagram.com"
                />
              </div>

              <div className=" w-full grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
                <FormField
                  label={'Contact Email'}
                  name={'email'}
                  register={register}
                  required={false}
                  errors={errors}
                  placeholder="www://email.com"
                />
                <FormField
                  label={'Contact Phone'}
                  name={'contactPhone'}
                  register={register}
                  required={false}
                  errors={errors}
                  placeholder="Phone Number"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </>
  )
}

export default DSiteSettingsPage
