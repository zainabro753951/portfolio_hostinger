// src/components/AppInitializer.jsx
import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, batch } from "react-redux";

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
import { useGetVisitorsCount } from "../Queries/GetVisitorsCount";

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
import { addVisitorsCount } from "../features/visitorsSlice";

// 🧩 Components
import ErrorFallback from "./ErrorFallBack";

// 📋 Configuration Map - Single source of truth
const DATA_CONFIG = [
  {
    key: "projects",
    action: addProjects,
    dataPath: "projects",
    transform: (d) => ({ projects: d?.projects || [] }),
  },
  {
    key: "settings",
    action: setSiteSettings,
    dataPath: "siteSettings",
    transform: (d) => ({ settings: d?.siteSettings || {} }),
  },
  {
    key: "about",
    action: addAbout,
    dataPath: "about",
    transform: (d) => ({ about: d?.about || {} }),
  },
  {
    key: "skills",
    action: addSkills,
    dataPath: "skills",
    transform: (d) => ({ skills: d?.skills || [] }),
  },
  {
    key: "education",
    action: addEduc,
    dataPath: "education",
    transform: (d) => ({ education: d?.education || [] }),
  },
  {
    key: "experience",
    action: addExp,
    dataPath: "experiences",
    transform: (d) => ({ experiences: d?.experiences || [] }),
  },
  {
    key: "testimonials",
    action: addTesti,
    dataPath: "testimonials",
    transform: (d) => ({ testimonials: d?.testimonials || [] }),
  },
  {
    key: "plans",
    action: addPlan,
    dataPath: "plans",
    transform: (d) => ({ plans: d?.plans || [] }),
  },
  {
    key: "services",
    action: addServices,
    dataPath: "services",
    transform: (d) => ({ services: d?.services || [] }),
  },
  {
    key: "faqs",
    action: addFAQs,
    dataPath: "faqs",
    transform: (d) => ({ faqs: d?.faqs || [] }),
  },
  {
    key: "messages",
    action: addContactMessages,
    dataPath: "data",
    transform: (d) => ({
      memoizedMessage: d?.data || [],
      memoizedCurrentMsgCount: d?.count || 0,
      memoizedCurrentPage: d?.currentPage || 1,
      memoizedTotalMsgPages: d?.totalPages || 1,
      memoizedAllEntriesCount: d?.total || 0,
    }),
  },
  {
    key: "visitorsCount",
    action: addVisitorsCount,
    dataPath: "visitorsCount",
    transform: (d) => ({ visitorsCount: d?.visitorsCount || 0 }),
    skipLoading: true, // Always has data (even if 0)
  },
];

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  // 🔄 Track processed data to prevent duplicate dispatches
  const processedRefs = useRef(new Map());

  // ✅ Fetch all queries
  const queries = {
    projects: useGetProjectsQuery(),
    settings: useGetSiteSettingsQuery(),
    about: useGetAbout(),
    skills: useGetSkills(),
    education: useGetEducation(),
    experience: useGetExp(),
    testimonials: useGetTestimonial(),
    plans: useGetPlan(),
    messages: useGetMessage(),
    services: useGetService(),
    faqs: useGetFAQ(),
    visitorsCount: useGetVisitorsCount(),
  };

  // 🚀 Optimized dispatch with batching and deduplication
  const syncData = useCallback(() => {
    const updates = [];
    const loadingStates = [];

    DATA_CONFIG.forEach(({ key, action, transform, skipLoading }) => {
      const query = queries[key];
      const isLoading = query.isFetching || query.isPending;
      const hasData = query.data !== undefined;

      // Create unique key for this state
      const stateKey = `${key}-${isLoading}-${JSON.stringify(query.data)}`;
      const lastProcessed = processedRefs.current.get(key);

      // Skip if already processed this exact state
      if (lastProcessed === stateKey) return;

      // Update tracking
      processedRefs.current.set(key, stateKey);

      // Collect loading state
      if (!skipLoading) {
        loadingStates.push({ action, isLoading });
      }

      // Collect data update (only when not loading and has data)
      if (!isLoading && hasData) {
        const payload = transform(query.data);
        // Only dispatch if data actually changed
        if (
          Object.values(payload).some((v) =>
            Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0,
          )
        ) {
          updates.push({ action, payload: { ...payload, isLoading: false } });
        }
      }
    });

    // 🎯 Batch all dispatches together (single re-render)
    batch(() => {
      // First: Set all loading states
      loadingStates.forEach(({ action, isLoading }) => {
        dispatch(action({ isLoading }));
      });

      // Then: Set all data
      updates.forEach(({ action, payload }) => {
        dispatch(action(payload));
      });
    });
  }, [queries, dispatch]);

  // 🎯 Single effect for all data synchronization
  useEffect(() => {
    syncData();
  }, [syncData]);

  // ⚡ Memoized global states
  const globalState = React.useMemo(() => {
    const queryArray = Object.values(queries);

    return {
      isLoading: queryArray.some((q) => q.isFetching || q.isPending),
      isError: queryArray.some((q) => q.isError),
      error: queryArray.find((q) => q.isError)?.error,
    };
  }, [queries]);

  // 🚨 Error handling
  if (globalState.isError) {
    return <ErrorFallback error={globalState.error} />;
  }

  // Optional: Show nothing or minimal loader during initial load
  // This prevents flash of unstyled content
  if (globalState.isLoading && processedRefs.current.size === 0) {
    return null; // Or return a sleek loading spinner
  }

  return children;
};

// 🎨 Custom comparison for React.memo - deep compare queries object
const areEqual = (prevProps, nextProps) => {
  return prevProps.children === nextProps.children;
};

export default React.memo(AppInitializer, areEqual);
