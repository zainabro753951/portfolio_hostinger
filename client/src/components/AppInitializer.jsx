import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, batch } from "react-redux";
import ErrorFallback from "./ErrorFallBack";

// 🧩 Public Queries
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

// 📋 PUBLIC DATA CONFIG
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
  const isFirstLoad = useRef(true);

  // ✅ Public queries - RTK Query handles caching automatically
  const queries = {
    projects: useGetProjectsQuery(undefined, {
      refetchOnMountOrArgChange: false,
    }),
    settings: useGetSiteSettingsQuery(undefined, {
      refetchOnMountOrArgChange: false,
    }),
    about: useGetAbout(undefined, { refetchOnMountOrArgChange: false }),
    skills: useGetSkills(undefined, { refetchOnMountOrArgChange: false }),
    education: useGetEducation(undefined, { refetchOnMountOrArgChange: false }),
    experience: useGetExp(undefined, { refetchOnMountOrArgChange: false }),
    testimonials: useGetTestimonial(undefined, {
      refetchOnMountOrArgChange: false,
    }),
    plans: useGetPlan(undefined, { refetchOnMountOrArgChange: false }),
    services: useGetService(undefined, { refetchOnMountOrArgChange: false }),
    faqs: useGetFAQ(undefined, { refetchOnMountOrArgChange: false }),
    visitorsCount: useGetVisitorsCount(undefined, {
      refetchOnMountOrArgChange: false,
    }),
  };

  // 🎯 Stable sync function with proper dependency tracking
  const syncData = useCallback(() => {
    const updates = [];
    const loadingStates = [];
    let hasNewData = false;

    PUBLIC_DATA_CONFIG.forEach(({ key, action, transform, skipLoading }) => {
      const query = queries[key];
      if (!query) return;

      const isLoading = query.isFetching || query.isPending;
      const hasData = query.data !== undefined && query.data !== null;

      // 🔑 Use data fingerprint for change detection
      const dataFingerprint = hasData
        ? JSON.stringify(query.data).slice(0, 500)
        : "no-data";
      const stateKey = `${key}-${isLoading}-${dataFingerprint}`;
      const lastProcessed = processedRefs.current.get(key);

      // Skip if already processed this exact state
      if (lastProcessed === stateKey) return;
      processedRefs.current.set(key, stateKey);

      if (!skipLoading) {
        loadingStates.push({ action, isLoading });
      }

      // ✅ Only dispatch data when NOT loading and data exists
      if (!isLoading && hasData && !query.isError) {
        const payload = transform(query.data);
        const hasValidData = Object.values(payload).some((v) =>
          Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0,
        );

        if (hasValidData) {
          updates.push({ action, payload: { ...payload, isLoading: false } });
          hasNewData = true;
        }
      }

      // ⚠️ Handle auth errors silently
      if (query.isError) {
        const status = query.error?.status || query.error?.response?.status;
        if (status === 401 || status === 403) {
          dispatch(action({ isLoading: false, isError: false }));
        }
      }
    });

    // 🚀 Batch all dispatches together
    if (loadingStates.length > 0 || updates.length > 0) {
      batch(() => {
        loadingStates.forEach(({ action, isLoading }) => {
          dispatch(action({ isLoading }));
        });
        updates.forEach(({ action, payload }) => {
          dispatch(action(payload));
        });
      });
    }

    // Mark first load complete
    if (hasNewData && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [queries, dispatch]);

  // 🎯 Run sync on mount and when queries change
  useEffect(() => {
    syncData();
  }, [syncData]);

  // 🎯 Global state computation
  const globalState = useMemo(() => {
    const queryArray = Object.values(queries);

    const isLoading = queryArray.some((q) => q.isFetching || q.isPending);
    const hasData = queryArray.some(
      (q) => q.data !== undefined && q.data !== null,
    );

    const fatalErrors = queryArray.filter((q) => {
      if (!q.isError) return false;
      const status = q.error?.status || q.error?.response?.status;
      return ![401, 403].includes(status);
    });

    return {
      isLoading,
      hasData,
      hasFatalError: fatalErrors.length > 0,
      fatalError: fatalErrors[0]?.error,
      isFirstLoad: isFirstLoad.current,
    };
  }, [queries]);

  // 🚨 Fatal error fallback
  if (globalState.hasFatalError) {
    return <ErrorFallback error={globalState.fatalError} />;
  }

  // ⏳ Show nothing during initial load (prevents undefined flash)
  if (globalState.isLoading && !globalState.hasData && isFirstLoad.current) {
    return null;
  }

  return children;
};

export default React.memo(
  AppInitializer,
  (prev, next) => prev.children === next.children,
);
