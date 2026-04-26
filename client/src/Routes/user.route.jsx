import { lazy, Suspense, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Ya apna custom loading

// 🚀 Lazy load all user pages - Code Splitting
const Layout = lazy(() => import("../components/Layout"));
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Services = lazy(() => import("../pages/Services"));
const Projects = lazy(() => import("../pages/Projects"));
const Reviews = lazy(() => import("../pages/Reviews"));
const Contact = lazy(() => import("../pages/Contact"));
const ServiceDetailsPage = lazy(() => import("../pages/ServiceDetailsPage"));

// 🎯 Suspense Wrapper with elegant loading
const withUserSuspense = (Component, displayName) => {
  const WrappedComponent = (props) => (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `withUserSuspense(${displayName})`;
  return WrappedComponent;
};

// 📋 Pre-wrapped components (memoized)
const WrappedLayout = withUserSuspense(Layout, "Layout");
const WrappedHome = withUserSuspense(Home, "Home");
const WrappedAbout = withUserSuspense(About, "About");
const WrappedServices = withUserSuspense(Services, "Services");
const WrappedProjects = withUserSuspense(Projects, "Projects");
const WrappedReviews = withUserSuspense(Reviews, "Reviews");
const WrappedContact = withUserSuspense(Contact, "Contact");
const WrappedServiceDetailsPage = withUserSuspense(
  ServiceDetailsPage,
  "ServiceDetailsPage",
);

// 🚀 Optimized Route Configuration
export const userRoutes = [
  {
    path: "/",
    element: <WrappedLayout />,
    children: [
      { index: true, element: <WrappedHome /> },
      { path: "about", element: <WrappedAbout /> },
      { path: "services", element: <WrappedServices /> },
      { path: "projects", element: <WrappedProjects /> },
      { path: "reviews", element: <WrappedReviews /> },
      { path: "contact", element: <WrappedContact /> },
      { path: "services/:slug", element: <WrappedServiceDetailsPage /> },
    ],
  },
];

// 🎯 Route metadata for SEO/Navigation
export const userRouteMeta = {
  "/": { title: "Home", description: "Welcome to my portfolio" },
  "/about": { title: "About", description: "Learn more about me" },
  "/services": { title: "Services", description: "What I offer" },
  "/projects": { title: "Projects", description: "My recent work" },
  "/reviews": { title: "Reviews", description: "Client testimonials" },
  "/contact": { title: "Contact", description: "Get in touch" },
  "/services/:slug": {
    title: "ServiceDetailsPage",
    description: "Learn more about services",
  },
};

// 🚀 Preload utility for predictive loading
export const preloadUserPage = (path) => {
  const preloadMap = {
    "/": () => import("../pages/Home"),
    "/about": () => import("../pages/About"),
    "/services": () => import("../pages/Services"),
    "/projects": () => import("../pages/Projects"),
    "/reviews": () => import("../pages/Reviews"),
    "/contact": () => import("../pages/Contact"),
    "/services/:slug": () => import("../pages/ServiceDetailsPage"),
  };

  const loader = preloadMap[path];
  if (loader) {
    requestIdleCallback(() => {
      loader();
    });
  }
};

// 🎯 Navigation component with hover preloading
export const NavLinkWithPreload = memo(({ to, children, ...props }) => {
  const handleMouseEnter = () => {
    preloadUserPage(to);
  };

  return (
    <a href={to} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </a>
  );
});
NavLinkWithPreload.displayName = "NavLinkWithPreload";
