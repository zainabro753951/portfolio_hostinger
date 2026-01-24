import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const superAdminCheckAuth = async () => {
  const response = await api.post(`/super-admin/auth`)
  return response.data
}

export const checkAuth = () => {
  return useQuery({
    queryKey: ['secureRoute'],
    queryFn: superAdminCheckAuth,
    retry: 1,
  })
}
