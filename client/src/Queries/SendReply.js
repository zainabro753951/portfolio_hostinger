import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

// Simple API function
const sendEmailReply = async (formData) => {
  const response = await api.post("/message/reply", formData);
  return response.data;
};

export const useSendReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendEmailReply,

    onSuccess: (_, formData) => {
      const originalMessageId = formData.get("originalMessageId");

      // Just refetch data
      queryClient.invalidateQueries(["contactMessages"]);
      queryClient.invalidateQueries(["emailHistory", originalMessageId]);
    },

    onError: (error) => {
      console.error("Error sending reply:", error);
    },
  });
};
