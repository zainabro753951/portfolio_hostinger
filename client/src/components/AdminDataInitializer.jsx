import { useEffect, useRef, useCallback } from "react";
import { useDispatch, batch } from "react-redux";
import { useGetActivities } from "../Queries/GetRecentyActivity";
import { useGetMessage } from "../Queries/GetMessage";
import { fetchActivities } from "../features/recentActivitySlice";
import { addContactMessages } from "../features/messageSlice";

const AdminDataInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const processedActivities = useRef(false);
  const processedMessages = useRef(false);

  const activitiesQuery = useGetActivities(undefined, {
    refetchOnMountOrArgChange: false,
    skip: false,
  });

  const messagesQuery = useGetMessage(undefined, {
    refetchOnMountOrArgChange: false,
    skip: false,
  });

  // 🎯 Stable activities handler
  const handleActivities = useCallback(() => {
    if (processedActivities.current) return;

    if (activitiesQuery.isError) {
      const status =
        activitiesQuery.error?.status ||
        activitiesQuery.error?.response?.status;

      if (status === 401 || status === 403) {
        dispatch(fetchActivities({ isLoading: false, isError: false }));
      } else {
        dispatch(
          fetchActivities({
            isError: true,
            errorMessage:
              activitiesQuery.error?.response?.data?.message ||
              activitiesQuery.error?.message ||
              "Failed to load activities",
            isLoading: false,
          }),
        );
      }
      processedActivities.current = true;
      return;
    }

    if (activitiesQuery.data?.activities && !activitiesQuery.isLoading) {
      dispatch(
        fetchActivities({
          activities: activitiesQuery.data.activities,
          isLoading: false,
          isError: false,
          errorMessage: "",
        }),
      );
      processedActivities.current = true;
    }
  }, [activitiesQuery, dispatch]);

  // 🎯 Stable messages handler
  const handleMessages = useCallback(() => {
    if (processedMessages.current) return;

    if (
      messagesQuery.isSuccess &&
      messagesQuery.data?.data &&
      !messagesQuery.isLoading
    ) {
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
      processedMessages.current = true;
    }

    if (messagesQuery.isError) {
      const status =
        messagesQuery.error?.status || messagesQuery.error?.response?.status;
      if (status === 401 || status === 403) {
        dispatch(addContactMessages({ isLoading: false, isError: false }));
      }
      processedMessages.current = true;
    }
  }, [messagesQuery, dispatch]);

  // 🚀 Run handlers in batched effect
  useEffect(() => {
    batch(() => {
      handleActivities();
      handleMessages();
    });
  }, [handleActivities, handleMessages]);

  return children;
};

export default AdminDataInitializer;
