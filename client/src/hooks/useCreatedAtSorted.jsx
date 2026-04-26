import { useMemo } from "react";

// 🎯 Kitne time tak "recently updated" maana jaye (milliseconds)
// Example: 24 hours = 24 * 60 * 60 * 1000
const RECENT_UPDATE_THRESHOLD = 24 * 60 * 60 * 1000;

const useCreatedAtSorted = (data) => {
  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    const now = Date.now();

    return [...data].sort((a, b) => {
      const aCreatedAt = new Date(a.createdAt).getTime();
      const bCreatedAt = new Date(b.createdAt).getTime();
      const aUpdatedAt = new Date(a.updatedAt).getTime();
      const bUpdatedAt = new Date(b.updatedAt).getTime();

      // Check karein ke kya item recently updated hai?
      const aIsRecent = now - aUpdatedAt <= RECENT_UPDATE_THRESHOLD;
      const bIsRecent = now - bUpdatedAt <= RECENT_UPDATE_THRESHOLD;

      // ✅ Case 1: Dono recently updated hain → updatedAt se sort karo
      if (aIsRecent && bIsRecent) {
        return bUpdatedAt - aUpdatedAt;
      }

      // ✅ Case 2: Sirf a recently updated hai → a upar aaye
      if (aIsRecent && !bIsRecent) {
        return -1;
      }

      // ✅ Case 3: Sirf b recently updated hai → b upar aaye
      if (!aIsRecent && bIsRecent) {
        return 1;
      }

      // ✅ Case 4: Koi bhi recently updated nahi → createdAt se sort karo
      return bCreatedAt - aCreatedAt;
    });
  }, [data]); // ⚠️ Dependency array zaroor lagayein!

  return { sortedData };
};

export default useCreatedAtSorted;
