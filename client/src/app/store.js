import { configureStore } from '@reduxjs/toolkit';
import aboutReducer from '../features/aboutSlice.js';
import adminAuthReducer from '../features/authSlice.js';
import educationReducer from '../features/educationSlice.js';
import experienceReducer from '../features/experienceSlice.js';
import FAQReducer from '../features/FAQSlice.js';
import contactMessagesReducer from '../features/messageSlice';
import notificationReducer from '../features/notificationSlice.js';
import planReducer from '../features/planSlice.js';
import projectReducer from '../features/projectSlice.js';
import activitiesReducer from '../features/recentActivitySlice.js';
import serviceReducer from '../features/serviceSlice.js';
import siteSettingsReducer from '../features/siteSettingsSlice.js';
import skillsReducer from '../features/skillSlice.js';
import testimonialReducer from '../features/testimonialSlice.js';
import visitorsCountReducer from '../features/visitorsSlice.js';

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
