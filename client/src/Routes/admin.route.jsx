import { lazy, Suspense, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Ya apna loading component
import ThemeReloader from "../components/ThemeReloader";

// 🚀 Lazy load all admin pages - Code Splitting
const DEducPage = lazy(() => import("../pages/admin/DEducation/DEducPage"));
const DPricingPlanPage = lazy(
  () => import("../pages/admin/DPricingPlan/DPricingPlanPage"),
);
const DSiteSettingsPage = lazy(
  () => import("../pages/admin/DSiteSettings/DSiteSettingsPage"),
);
const DTestimonialPage = lazy(
  () => import("../pages/admin/DTestimonial/DTestimonialPage"),
);
const DAboutPage = lazy(() => import("../pages/admin/DAbout/DAboutPage"));
const DProjectsPage = lazy(
  () => import("../pages/admin/DProjects/DProjectsPage"),
);
const DAddProjectPage = lazy(
  () => import("../pages/admin/DAddProject/DAddProjectPage"),
);
const DSkillsPage = lazy(() => import("../pages/admin/DSkills/DSkillsPage"));
const DContactMessagePage = lazy(
  () => import("../pages/admin/DContactMessage/DContactMessagePage"),
);
const DAnalyticsPage = lazy(
  () => import("../pages/admin/DAnalytics/DAnalyticsPage"),
);
const DExperiencePage = lazy(
  () => import("../pages/admin/DExperience/DExperiencePage"),
);
const DServicesPage = lazy(
  () => import("../pages/admin/DServices/DServicesPage"),
);
const DFaqsPage = lazy(() => import("../pages/admin/DFaqs/DFaqsPage"));

// 🎯 Suspense Wrapper with consistent loading UI
const withAdminSuspense = (Component) => {
  const WrappedComponent = (props) => (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );

  // Display name for debugging
  WrappedComponent.displayName = `withAdminSuspense(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// 📋 Pre-wrapped components (memoized)
const WrappedDProjectsPage = withAdminSuspense(DProjectsPage);
const WrappedDAddProjectPage = withAdminSuspense(DAddProjectPage);
const WrappedDAboutPage = withAdminSuspense(DAboutPage);
const WrappedDSkillsPage = withAdminSuspense(DSkillsPage);
const WrappedDEducPage = withAdminSuspense(DEducPage);
const WrappedDExperiencePage = withAdminSuspense(DExperiencePage);
const WrappedDServicesPage = withAdminSuspense(DServicesPage);
const WrappedDFaqsPage = withAdminSuspense(DFaqsPage);
const WrappedDTestimonialPage = withAdminSuspense(DTestimonialPage);
const WrappedDPricingPlanPage = withAdminSuspense(DPricingPlanPage);
const WrappedDSiteSettingsPage = withAdminSuspense(DSiteSettingsPage);
const WrappedDContactMessagePage = withAdminSuspense(DContactMessagePage);
const WrappedDAnalyticsPage = withAdminSuspense(DAnalyticsPage);

// 🚀 Optimized Route Configuration
// Grouped by entity for better maintainability
export const adminRoutes = [
  // 📁 Projects Group
  { path: "projects", elem: <WrappedDProjectsPage /> },
  { path: "add-project", elem: <WrappedDAddProjectPage /> },
  { path: "add-project/:id", elem: <WrappedDAddProjectPage /> },

  // 👤 About Group
  { path: "about", elem: <WrappedDAboutPage /> },

  // 🛠️ Skills Group
  { path: "skills", elem: <WrappedDSkillsPage /> },
  { path: "skills/:id", elem: <WrappedDSkillsPage /> },

  // 🎓 Education Group
  { path: "education", elem: <WrappedDEducPage /> },
  { path: "education/:id", elem: <WrappedDEducPage /> },

  // 💼 Experience Group
  { path: "experience", elem: <WrappedDExperiencePage /> },
  { path: "experience/:id", elem: <WrappedDExperiencePage /> },

  // 🎯 Services Group
  { path: "services", elem: <WrappedDServicesPage /> },
  { path: "services/:id", elem: <WrappedDServicesPage /> },

  // ❓ FAQs Group
  { path: "faqs", elem: <WrappedDFaqsPage /> },
  { path: "faqs/:id", elem: <WrappedDFaqsPage /> },

  // ⭐ Testimonials Group
  { path: "testimonials", elem: <WrappedDTestimonialPage /> },
  { path: "testimonials/:id", elem: <WrappedDTestimonialPage /> },

  // 💰 Pricing Group
  { path: "pricing-plan", elem: <WrappedDPricingPlanPage /> },
  { path: "pricing-plan/:id", elem: <WrappedDPricingPlanPage /> },

  // ⚙️ Settings Group
  { path: "site-settings", elem: <WrappedDSiteSettingsPage /> },

  // 📨 Messages Group
  { path: "user-messages", elem: <WrappedDContactMessagePage /> },

  // 📊 Analytics Group
  { path: "analytics", elem: <WrappedDAnalyticsPage /> },
];

// 🎯 Route Groups for sidebar/menu generation (optional utility)
export const adminRouteGroups = [
  {
    title: "Content",
    icon: "LayoutDashboard",
    routes: ["projects", "about", "site-settings"],
  },
  {
    title: "Resume",
    icon: "FileText",
    routes: ["skills", "education", "experience"],
  },
  {
    title: "Services",
    icon: "Briefcase",
    routes: ["services", "faqs"],
  },
  {
    title: "Marketing",
    icon: "Megaphone",
    routes: ["testimonials", "pricing-plan"],
  },
  {
    title: "Communication",
    icon: "MessageSquare",
    routes: ["user-messages"],
  },
  {
    title: "Analytics",
    icon: "BarChart3",
    routes: ["analytics"],
  },
];

// 🚀 Preload utility for predictive loading
export const preloadAdminPage = (path) => {
  const preloadMap = {
    projects: () => import("../pages/admin/DProjects/DProjectsPage"),
    "add-project": () => import("../pages/admin/DAddProject/DAddProjectPage"),
    about: () => import("../pages/admin/DAbout/DAboutPage"),
    skills: () => import("../pages/admin/DSkills/DSkillsPage"),
    education: () => import("../pages/admin/DEducation/DEducPage"),
    experience: () => import("../pages/admin/DExperience/DExperiencePage"),
    services: () => import("../pages/admin/DServices/DServicesPage"),
    faqs: () => import("../pages/admin/DFaqs/DFaqsPage"),
    testimonials: () => import("../pages/admin/DTestimonial/DTestimonialPage"),
    "pricing-plan": () =>
      import("../pages/admin/DPricingPlan/DPricingPlanPage"),
    "site-settings": () =>
      import("../pages/admin/DSiteSettings/DSiteSettingsPage"),
    "user-messages": () =>
      import("../pages/admin/DContactMessage/DContactMessagePage"),
    analytics: () => import("../pages/admin/DAnalytics/DAnalyticsPage"),
  };

  const loader = preloadMap[path];
  if (loader) {
    // Preload after current page settles
    requestIdleCallback(() => {
      loader();
    });
  }
};
