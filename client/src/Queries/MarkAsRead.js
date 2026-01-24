import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const markasRead = async ids => {
  const res = await api.post('/message/mark-as-read', { ids })
  return res.data
}

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: markasRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] })
    },
  })
}
