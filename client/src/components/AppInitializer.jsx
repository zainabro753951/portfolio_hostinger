// src/components/AppInitializer.jsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, batch } from "react-redux";

// 🧩 Queries - Sirf PUBLIC data
import { useGetProjectsQuery } from "../Queries/GetProjects";
import { useGetSiteSettingsQuery } from "../Queries/GetSiteSetting";
import { useGetAbout } from "../Queries/GetAbout";
import { useGetSkills } from "../Queries/GetSkills";
import { useGetEducation } from "../Queries/GetEducation";
import { useGetTestimonial } from "../Queries/GetTestimonial";
import { useGetPlan } from "../Queries/GetPlan";
import { useGetExp } from "../Queries/GetExp";
import { useGetService } from "../Queries/GetServices";
import { useGetFAQ } from "../Queries/GetFAQ";
import { useGetVisitorsCount } from "../Queries/GetVisitorsCount";

// 🧩 Slices
import { addProjects } from "../features/projectSlice";
import { setSiteSettings } from "../features/siteSettingsSlice";
import { addAbout } from "../features/aboutSlice";
import { addSkills } from "../features/skillSlice";
import { addEduc } from "../features/educationSlice";
import { addTesti } from "../features/testimonialSlice";
import { addPlan } from "../features/planSlice";
import { addExp } from "../features/experienceSlice";
import { addServices } from "../features/serviceSlice";
import { addFAQs } from "../features/FAQSlice";
import { addVisitorsCount } from "../features/visitorsSlice";

// 📋 PUBLIC DATA CONFIG - Admin-only data (messages) hata diya
const PUBLIC_DATA_CONFIG = [
  {
    key: "projects",
    action: addProjects,
    transform: (d) => ({ projects: d?.projects || [] }),
  },
  {
    key: "settings",
    action: setSiteSettings,
    transform: (d) => ({ settings: d?.siteSettings || {} }),
  },
  {
    key: "about",
    action: addAbout,
    transform: (d) => ({ about: d?.about || {} }),
  },
  {
    key: "skills",
    action: addSkills,
    transform: (d) => ({ skills: d?.skills || [] }),
  },
  {
    key: "education",
    action: addEduc,
    transform: (d) => ({ education: d?.education || [] }),
  },
  {
    key: "experience",
    action: addExp,
    transform: (d) => ({ experiences: d?.experiences || [] }),
  },
  {
    key: "testimonials",
    action: addTesti,
    transform: (d) => ({ testimonials: d?.testimonials || [] }),
  },
  {
    key: "plans",
    action: addPlan,
    transform: (d) => ({ plans: d?.plans || [] }),
  },
  {
    key: "services",
    action: addServices,
    transform: (d) => ({ services: d?.services || [] }),
  },
  {
    key: "faqs",
    action: addFAQs,
    transform: (d) => ({ faqs: d?.faqs || [] }),
  },
  {
    key: "visitorsCount",
    action: addVisitorsCount,
    transform: (d) => ({ visitorsCount: d?.visitorsCount || 0 }),
    skipLoading: true,
  },
];

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const processedRefs = useRef(new Map());

  // ✅ Sirf public queries
  const queries = {
    projects: useGetProjectsQuery(),
    settings: useGetSiteSettingsQuery(),
    about: useGetAbout(),
    skills: useGetSkills(),
    education: useGetEducation(),
    experience: useGetExp(),
    testimonials: useGetTestimonial(),
    plans: useGetPlan(),
    services: useGetService(),
    faqs: useGetFAQ(),
    visitorsCount: useGetVisitorsCount(),
  };

  const syncData = useCallback(() => {
    const updates = [];
    const loadingStates = [];

    PUBLIC_DATA_CONFIG.forEach(({ key, action, transform, skipLoading }) => {
      const query = queries[key];
      if (!query) return;

      const isLoading = query.isFetching || query.isPending;
      const hasData = query.data !== undefined;
      const stateKey = `${key}-${isLoading}-${JSON.stringify(query.data)}`;
      const lastProcessed = processedRefs.current.get(key);

      if (lastProcessed === stateKey) return;
      processedRefs.current.set(key, stateKey);

      if (!skipLoading) {
        loadingStates.push({ action, isLoading });
      }

      // ✅ Auth errors (401/403) ko skip karein, fatal na maanein
      if (!isLoading && hasData && !query.isError) {
        const payload = transform(query.data);
        if (
          Object.values(payload).some((v) =>
            Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0,
          )
        ) {
          updates.push({ action, payload: { ...payload, isLoading: false } });
        }
      }

      // ⚠️ Agar 401/403 aaye toh silently skip karein (admin-only data ke liye)
      if (query.isError) {
        const status = query.error?.response?.status;
        if (status === 401 || status === 403) {
          // Auth error - silently ignore for public initializer
          dispatch(action({ isLoading: false, isError: false }));
        }
      }
    });

    batch(() => {
      loadingStates.forEach(({ action, isLoading }) => {
        dispatch(action({ isLoading }));
      });
      updates.forEach(({ action, payload }) => {
        dispatch(action(payload));
      });
    });
  }, [queries, dispatch]);

  useEffect(() => {
    syncData();
  }, [syncData]);

  // 🎯 Global state - Sirf NON-AUTH errors ko fatal maanein
  const globalState = useMemo(() => {
    const queryArray = Object.values(queries);
    const fatalErrors = queryArray.filter(
      (q) => q.isError && ![401, 403].includes(q.error?.response?.status),
    );

    return {
      isLoading: queryArray.some((q) => q.isFetching || q.isPending),
      hasFatalError: fatalErrors.length > 0,
      fatalError: fatalErrors[0]?.error,
    };
  }, [queries]);

  // 🚨 Sirf fatal errors par hi ErrorFallback dikhayein
  if (globalState.hasFatalError) {
    return <ErrorFallback error={globalState.fatalError} />;
  }

  // Initial load par minimal loader
  if (globalState.isLoading && processedRefs.current.size === 0) {
    return null;
  }

  return children;
};

export default React.memo(
  AppInitializer,
  (prev, next) => prev.children === next.children,
);
