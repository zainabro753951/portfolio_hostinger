import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  activeUsersCount: 0,
  site_info: {},
  seo_pages: [],
  seo_page: {},
  contact_info: {},
}

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    // ✅ Save all site settings together
    setSiteSettings: (state, action) => {
      const { isLoading, settings } = action.payload

      const siteInfo = settings?.siteInfo || null
      const seoPages = settings?.seoPages || null
      const contactInfo = settings?.contactInfo || null

      // Step 1: Always update loading state first
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // Step 2: Only update data when loading is finished
      if (!isLoading) {
        state.site_info = siteInfo || {}
        state.seo_pages = seoPages || []
        state.contact_info = contactInfo || {}
      }
    },

    // ✅ Update specific parts individually (optional use in dashboard)
    setSiteInfo: (state, action) => {
      state.site_info = { ...action.payload }
    },
    setSeoPages: (state, action) => {
      state.seo_pages = [...action.payload]
    },
    setContactInfo: (state, action) => {
      state.contact_info = { ...action.payload }
    },

    findSeoPageBySlug: (state, action) => {
      const seoPageSlug = action.payload
      const found = state.seo_pages.find(
        seo => seo?.pageSlug?.toLowerCase() === seoPageSlug?.toLowerCase()
      )
      state.seo_page = found
    },

    clearSeoPage: state => {
      state.seo_page = {}
    },

    setActiveUsersCount: (state, action) =>{
      state.activeUsersCount = action.payload.count
    },

    // ✅ Reset on logout or refresh
    resetSiteSettings: () => initialState,
  },
})

export const {
  setSiteSettings,
  setSiteInfo,
  setSeoPages,
  setContactInfo,
  resetSiteSettings,
  clearSeoPage,
  findSeoPageBySlug,
  setActiveUsersCount
} = siteSettingsSlice.actions

export default siteSettingsSlice.reducer
