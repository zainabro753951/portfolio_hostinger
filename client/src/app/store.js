import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/authSlice.js";
import projectReducer from "../features/projectSlice.js";
import siteSettingsReducer from "../features/siteSettingsSlice.js";
import aboutReducer from "../features/aboutSlice.js";
import skillsReducer from "../features/skillSlice.js";
import educationReducer from "../features/educationSlice.js";
import testimonialReducer from "../features/testimonialSlice.js";
import planReducer from "../features/planSlice.js";
import contactMessagesReducer from "../features/messageSlice";
import notificationReducer from "../features/notificationSlice.js";
import experienceReducer from "../features/experienceSlice.js";
import serviceReducer from "../features/serviceSlice.js";
import FAQReducer from "../features/FAQSlice.js";
import activitiesReducer from "../features/recentActivitySlice.js";
import visitorsCountReducer from "../features/visitorsSlice.js";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    projects: projectReducer,
    about: aboutReducer,
    skills: skillsReducer,
    siteSettings: siteSettingsReducer,
    education: educationReducer,
    testimonial: testimonialReducer,
    plan: planReducer,
    contactMessages: contactMessagesReducer,
    notification: notificationReducer,
    experience: experienceReducer,
    service: serviceReducer,
    FAQ: FAQReducer,
    activities: activitiesReducer,
    visitorsCount: visitorsCountReducer,
  },
});
