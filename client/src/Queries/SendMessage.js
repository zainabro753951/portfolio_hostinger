import api from '../api/axios'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../queryClient.js'

const sendMessage = async data => {
  const res = await api.post('/message/send', data)
  return res.data
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: sendMessage,

    // 👇 Optional optimistic update (agar UI live refresh chahiye)
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contactMessages'] })
    },

    // 👇 Invalidate contact messages after success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] })
    },

    // 👇 Error handling (frontend ke liye helpful)
    onError: error => {
      console.error('SEND_MESSAGE_ERROR:', error?.response?.data || error.message)
    },
  })
}
