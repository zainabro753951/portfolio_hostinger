import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addFaq = async data => {
  const res = await api.post('/faq/add', data)
  return res.data
}

export const useAddFAQ = () => {
  return useMutation({
    mutationFn: addFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['FAQs'] })
    },
  })
}
