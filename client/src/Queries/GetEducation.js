import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getEducation = async () => {
  const res = await api.get('/education/get')
  return res.data
}

export const useGetEducation = () => {
  return useQuery({
    queryKey: ['educations'],
    queryFn: getEducation,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
