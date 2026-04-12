import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  activeUsersCount: 0,
  socketStatus: {
    status: "disconnected", // 'connected' | 'disconnected' | 'error' | 'connecting'
    id: null,
    reason: null,
    error: null,
    lastConnected: null,
  },
  site_info: {},
  seo_pages: [],
  seo_page: {},
  contact_info: {},
};

const siteSettingsSlice = createSlice({
  name: "siteSettings",
  initialState,
  reducers: {
    // ✅ Save all site settings together
    setSiteSettings: (state, action) => {
      const { isLoading, settings } = action.payload;

      const siteInfo = settings?.siteInfo || null;
      const seoPages = settings?.seoPages || null;
      const contactInfo = settings?.contactInfo || null;

      // Step 1: Always update loading state first
      if (typeof isLoading === "boolean") {
        state.isLoading = isLoading;
      }

      // Step 2: Only update data when loading is finished
      if (!isLoading) {
        state.site_info = siteInfo || {};
        state.seo_pages = seoPages || [];
        state.contact_info = contactInfo || {};
      }
    },

    // ✅ Update specific parts individually (optional use in dashboard)
    setSiteInfo: (state, action) => {
      state.site_info = { ...state.site_info, ...action.payload };
    },
    setSeoPages: (state, action) => {
      state.seo_pages = [...action.payload];
    },
    setContactInfo: (state, action) => {
      state.contact_info = { ...state.contact_info, ...action.payload };
    },

    // ✅ SEO Page operations
    findSeoPageBySlug: (state, action) => {
      const seoPageSlug = action.payload;
      const found = state.seo_pages.find(
        (seo) => seo?.pageSlug?.toLowerCase() === seoPageSlug?.toLowerCase(),
      );
      state.seo_page = found || {};
    },

    addSeoPage: (state, action) => {
      state.seo_pages.push(action.payload);
    },

    updateSeoPage: (state, action) => {
      const { id, data } = action.payload;
      const index = state.seo_pages.findIndex((page) => page.id === id);
      if (index !== -1) {
        state.seo_pages[index] = { ...state.seo_pages[index], ...data };
      }
    },

    deleteSeoPage: (state, action) => {
      const id = action.payload;
      state.seo_pages = state.seo_pages.filter((page) => page.id !== id);
    },

    clearSeoPage: (state) => {
      state.seo_page = {};
    },

    // ✅ Socket Status Management
    setSocketStatus: (state, action) => {
      const { status, id, reason, error } = action.payload;

      state.socketStatus = {
        ...state.socketStatus,
        status: status || "disconnected",
        id: id || null,
        reason: reason || null,
        error: error || null,
        // Track last connected time when status changes to connected
        lastConnected:
          status === "connected"
            ? new Date().toISOString()
            : state.socketStatus.lastConnected,
      };
    },

    setActiveUsersCount: (state, action) => {
      state.activeUsersCount = action.payload.count || 0;
    },

    // ✅ Reset on logout or refresh
    resetSiteSettings: () => initialState,
  },
});

export const {
  setSiteSettings,
  setSiteInfo,
  setSeoPages,
  setContactInfo,
  addSeoPage,
  updateSeoPage,
  deleteSeoPage,
  resetSiteSettings,
  clearSeoPage,
  findSeoPageBySlug,
  setSocketStatus,
  setActiveUsersCount,
} = siteSettingsSlice.actions;

export default siteSettingsSlice.reducer;
