import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getActivities = async () => {
  const res = await api.get('/get/activities')
  return res.data
}

export const useGetActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
