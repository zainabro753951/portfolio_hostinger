import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getPlan = async () => {
  const res = await api.get('/plan/get')
  return res.data
}

export const useGetPlan = () => {
  return useQuery({
    queryKey: ['pricePlan'],
    queryFn: getPlan,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
