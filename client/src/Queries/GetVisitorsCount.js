import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const getVisitorsCount = async () => {
  const res = await api.get("/visitors/count");
  return res.data;
};

export const useGetVisitorsCount = () => {
  return useQuery({
    queryKey: ["visitorsCount"],
    queryFn: getVisitorsCount,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
