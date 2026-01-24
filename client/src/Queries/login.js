import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'

// ✅ API call function (pure async function)
const superAdminLoginRequest = async loginData => {
  const response = await api.post(`/super-admin/login`, loginData)
  return response.data
}

// ✅ Custom Hook using React Query
export const useSuperAdminLogin = () => {
  return useMutation({
    mutationFn: superAdminLoginRequest,
  })
}
