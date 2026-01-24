import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getService = async () => {
  const res = await api.get('/service/get')
  return res.data
}

export const useGetService = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getService,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
