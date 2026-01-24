// src/components/AppInitializer.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

// 🧩 Queries
import { useGetProjectsQuery } from "../Queries/GetProjects";
import { useGetSiteSettingsQuery } from "../Queries/GetSiteSetting";
import { useGetAbout } from "../Queries/GetAbout";
import { useGetSkills } from "../Queries/GetSkills";
import { useGetEducation } from "../Queries/GetEducation";
import { useGetTestimonial } from "../Queries/GetTestimonial";
import { useGetPlan } from "../Queries/GetPlan";
import { useGetMessage } from "../Queries/GetMessage";
import { useGetExp } from "../Queries/GetExp";
import { useGetService } from "../Queries/GetServices";
import { useGetFAQ } from "../Queries/GetFAQ";
import { useGetActivities } from "../Queries/GetRecentyActivity";

// 🧩 Slices
import { addProjects } from "../features/projectSlice";
import { setSiteSettings } from "../features/siteSettingsSlice";
import { addAbout } from "../features/aboutSlice";
import { addSkills } from "../features/skillSlice";
import { addEduc } from "../features/educationSlice";
import { addTesti } from "../features/testimonialSlice";
import { addPlan } from "../features/planSlice";
import { addContactMessages } from "../features/messageSlice";
import { addExp } from "../features/experienceSlice";
import { addServices } from "../features/serviceSlice";
import { addFAQs } from "../features/FAQSlice";
import { fetchActivities } from "../features/recentActivitySlice";

// 🧩 Components
import ErrorFallback from "./ErrorFallBack";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  // ✅ Fetch Queries
  const projects = useGetProjectsQuery();
  const settings = useGetSiteSettingsQuery();
  const about = useGetAbout();
  const skills = useGetSkills();
  const education = useGetEducation();
  const experience = useGetExp();
  const testimonial = useGetTestimonial();
  const plans = useGetPlan();
  const messages = useGetMessage();
  const services = useGetService();
  const faqs = useGetFAQ();
  const activities = useGetActivities();

  // ✅ Memoized Data
  const memo = useMemo(
    () => ({
      projects: projects.data?.projects || [],
      settings: settings.data?.siteSettings || {},
      about: about.data?.about || {},
      skills: skills.data?.skills || [],
      education: education.data?.education || [],
      experience: experience?.data?.experiences || [],
      services: services?.data?.services || [],
      faqs: faqs?.data?.faqs || [],
      activities: activities?.data?.activities || [],
      testimonials: testimonial.data?.testimonials || [],
      plans: plans.data?.plans || [],
      messages: messages.data?.data || [],
      msgCount: messages.data?.count || 0,
      msgCurrentPage: messages.data?.currentPage || 1,
      msgTotalPages: messages.data?.totalPages || 1,
      msgAllEntries: messages.data?.total || 0,
    }),
    [
      projects?.data,
      settings?.data,
      about?.data,
      skills?.data,
      education?.data,
      experience?.data,
      testimonial?.data,
      plans?.data,
      messages?.data,
      services?.data,
      faqs?.data,
      activities?.data,
    ],
  );

  // ✅ Utility: safely update reducers with loading + data
  const updateReducer = (action, data, isLoading) => {
    // Step 1: Always update loading state first
    dispatch(action({ isLoading }));

    // Step 2: Only update data when loading finished
    if (!isLoading && data) {
      dispatch(action({ ...data, isLoading: false }));
    }
  };

  // 🔹 Commit 1 — Projects
  useEffect(() => {
    const isLoading = projects.isFetching || projects.isPending;
    updateReducer(
      addProjects,
      memo.projects.length ? { projects: memo.projects } : null,
      isLoading,
    );
  }, [memo.projects, projects.isFetching, projects.isPending, dispatch]);

  // 🔹 Commit 2 — Site Settings
  useEffect(() => {
    const isLoading = settings.isFetching || settings.isPending;
    updateReducer(
      setSiteSettings,
      Object.keys(memo.settings).length ? { settings: memo.settings } : null,
      isLoading,
    );
  }, [memo.settings, settings.isFetching, settings.isPending, dispatch]);

  // 🔹 Commit 3 — About
  useEffect(() => {
    const isLoading = about.isFetching || about.isPending;
    const hasAbout = Object.keys(memo.about || {}).length > 0;
    updateReducer(addAbout, hasAbout ? { about: memo.about } : null, isLoading);
  }, [memo.about, about.isFetching, about.isPending, dispatch]);

  // 🔹 Commit 4 — Skills
  useEffect(() => {
    const isLoading = skills.isFetching || skills.isPending;
    updateReducer(
      addSkills,
      memo.skills.length ? { skills: memo.skills } : null,
      isLoading,
    );
  }, [memo.skills, skills.isFetching, skills.isPending, dispatch]);

  // 🔹 Commit 5 — Education
  useEffect(() => {
    const isLoading = education.isFetching || education.isPending;
    updateReducer(
      addEduc,
      memo.education.length ? { education: memo.education } : null,
      isLoading,
    );
  }, [memo.education, education.isFetching, education.isPending, dispatch]);

  // 🔹 Commit 6 — Experience
  useEffect(() => {
    const isLoading = experience.isFetching || experience.isPending;
    updateReducer(
      addExp,
      memo.experience.length ? { experiences: memo.experience } : null,
      isLoading,
    );
  }, [memo.experience, experience.isFetching, experience.isPending, dispatch]);

  // 🔹 Commit 7 — Testimonials
  useEffect(() => {
    const isLoading = testimonial.isFetching || testimonial.isPending;
    updateReducer(
      addTesti,
      memo.testimonials.length ? { testimonials: memo.testimonials } : null,
      isLoading,
    );
  }, [
    memo.testimonials,
    testimonial.isFetching,
    testimonial.isPending,
    dispatch,
  ]);

  // 🔹 Commit 8 — Pricing Plans
  useEffect(() => {
    const isLoading = plans.isFetching || plans.isPending;
    updateReducer(
      addPlan,
      memo.plans.length ? { plans: memo.plans } : null,
      isLoading,
    );
  }, [memo.plans, plans.isFetching, plans.isPending, dispatch]);

  // 🔹 Commit 9 — Contact Messages
  useEffect(() => {
    const isLoading = messages.isFetching || messages.isPending;
    updateReducer(
      addContactMessages,
      memo.messages.length
        ? {
            memoizedMessage: memo.messages,
            memoizedCurrentMsgCount: memo.msgCount,
            memoizedCurrentPage: memo.msgCurrentPage,
            memoizedTotalMsgPages: memo.msgTotalPages,
            memoizedAllEntriesCount: memo.msgAllEntries,
          }
        : null,
      isLoading,
    );
  }, [
    memo.messages,
    memo.msgCount,
    memo.msgCurrentPage,
    memo.msgTotalPages,
    memo.msgAllEntries,
    messages.isFetching,
    messages.isPending,
    dispatch,
  ]);

  // 🔹 Commit 10 — Services
  useEffect(() => {
    const isLoading = services.isFetching || services.isPending;
    updateReducer(
      addServices,
      memo.services.length ? { services: memo.services } : null,
      isLoading,
    );
  }, [memo.services, services.isFetching, services.isPending, dispatch]);

  // 🔹 Commit 11 — FAQs
  useEffect(() => {
    const isLoading = faqs.isFetching || faqs.isPending;
    updateReducer(
      addFAQs,
      memo.faqs.length ? { faqs: memo.faqs } : null,
      isLoading,
    );
  }, [memo.faqs, faqs.isFetching, faqs.isPending, dispatch]);

  // 🔹 Commit 12 — Activities
  useEffect(() => {
    const isLoading = activities.isFetching || activities.isPending;
    updateReducer(
      fetchActivities,
      memo.activities.length ? { activities: memo.activities } : null,
      isLoading,
    );
  }, [memo.activities, activities.isFetching, activities.isPending, dispatch]);

  // ✅ Global Loading/Error
  const isLoading = [
    projects,
    settings,
    about,
    skills,
    education,
    experience,
    testimonial,
    plans,
    services,
    faqs,
    messages,
  ].some((q) => q.isFetching || q.isPending);

  // const isError = [
  //   projects,
  //   settings,
  //   about,
  //   skills,
  //   education,
  //   experience,
  //   testimonial,
  //   plans,
  //   messages,
  //   services,
  //   faqs,
  // ].some((q) => q.isError);

  // // 🔹 Error Handling
  // if (isError) return <ErrorFallback />;

  return children;
};

export default React.memo(AppInitializer);
