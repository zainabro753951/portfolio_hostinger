import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getProjects = async () => {
  const res = await api.get('/project/get')
  return res.data
}

export const useGetProjectsQuery = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
