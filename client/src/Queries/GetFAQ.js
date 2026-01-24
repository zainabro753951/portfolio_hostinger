import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getFAQ = async () => {
  const res = await api.get('/faq/get')
  return res.data
}

export const useGetFAQ = () => {
  return useQuery({
    queryKey: ['FAQs'],
    queryFn: getFAQ,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
