// src/components/AdminDataInitializer.jsx
import { useEffect } from "react";
import { useGetActivities } from "../Queries/GetRecentyActivity";
import { useGetMessage } from "../Queries/GetMessage"; // Admin-only
import { useDispatch } from "react-redux";
import { fetchActivities } from "../features/recentActivitySlice";
import { addContactMessages } from "../features/messageSlice";

const AdminDataInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const activitiesQuery = useGetActivities();
  const messagesQuery = useGetMessage(); // Sirf admin ke liye

  useEffect(() => {
    // 🔹 Activities handling
    if (activitiesQuery.isError) {
      const status = activitiesQuery.error?.response?.status;
      if (status === 401 || status === 403) {
        // Auth error - silently ignore, admin nahi hai
        dispatch(fetchActivities({ isLoading: false, isError: false }));
      } else {
        dispatch(
          fetchActivities({
            isError: true,
            errorMessage:
              activitiesQuery.error?.response?.data?.message ||
              activitiesQuery.error?.message,
            isLoading: false,
          }),
        );
      }
      return;
    }

    if (activitiesQuery.data?.activities) {
      dispatch(
        fetchActivities({
          activities: activitiesQuery.data.activities,
          isLoading: false,
          isError: false,
          errorMessage: "",
        }),
      );
    }

    // 🔹 Messages handling (admin-only)
    if (messagesQuery.isSuccess && messagesQuery.data?.data) {
      const d = messagesQuery.data;
      dispatch(
        addContactMessages({
          memoizedMessage: d.data || [],
          memoizedCurrentMsgCount: d.count || 0,
          memoizedCurrentPage: d.currentPage || 1,
          memoizedTotalMsgPages: d.totalPages || 1,
          memoizedAllEntriesCount: d.total || 0,
          isLoading: false,
        }),
      );
    }

    // Auth error on messages - silently skip
    if (messagesQuery.isError) {
      const status = messagesQuery.error?.response?.status;
      if (status === 401 || status === 403) {
        dispatch(addContactMessages({ isLoading: false, isError: false }));
      }
    }
  }, [activitiesQuery, messagesQuery, dispatch]);

  return children;
};

export default AdminDataInitializer;
