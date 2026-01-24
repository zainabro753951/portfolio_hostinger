import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getTesi = async () => {
  const res = await api.get('/testimonial/get')
  return res.data
}

export const useGetTestimonial = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTesi,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
