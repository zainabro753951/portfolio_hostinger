import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getSkills = async () => {
  const res = await api.get('/skill/get')
  return res.data
}

export const useGetSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
