import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "../api/axios";

const getActivities = async () => {
  const res = await api.get("/get/activities");
  return res.data;
};

export const useGetActivities = () => {
  const { isAuth } = useSelector((s) => s.adminAuth);

  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
    enabled: isAuth, // 🔥 ADMIN ONLY
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
