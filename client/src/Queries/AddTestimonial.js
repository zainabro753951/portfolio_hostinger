import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addTestimonialFunc = async data => {
  const res = await api.post('/testimonial/add', data)
  return res.data
}

export const useAddTestimonial = () => {
  return useMutation({
    mutationFn: addTestimonialFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
