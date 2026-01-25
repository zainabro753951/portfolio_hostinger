import { useEffect } from "react";
import { useGetActivities } from "../Queries/GetRecentyActivity";
import { useDispatch } from "react-redux";
import { fetchActivities } from "../features/recentActivitySlice";

const AdminDataInitializer = ({ children }) => {
  const { isLoading, isFetching, data, isError, error } = useGetActivities();
  const dispatch = useDispatch();

  useEffect(() => {
    // 🔹 Loading state
    dispatch(fetchActivities({ isLoading: isLoading || isFetching }));

    // 🔹 Error state
    if (isError) {
      dispatch(
        fetchActivities({
          isError: true,
          errorMessage: error?.response?.data?.message || error?.message,
          isLoading: false,
        }),
      );
      return;
    }

    // 🔹 Data received
    if (data?.activities) {
      dispatch(
        fetchActivities({
          activities: data.activities,
          isLoading: false,
          isError: false,
          errorMessage: "",
        }),
      );
    }
  }, [isLoading, isFetching, data, isError, error, dispatch]);

  return children;
};

export default AdminDataInitializer;
