import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

const deleteEntry = async ({ route, ids }) => {
  const { data } = await api.delete(route, {
    data: { ids }, // DELETE requests mein body aise bhejte hain
  });
  return data;
};

export const useDeleteEntry = (queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      // Invalidate queries
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      // Generic messages bhi refresh karein
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
    },
  });
};
