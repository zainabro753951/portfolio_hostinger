import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getExp = async () => {
  const res = await api.get('/experience/get')
  return res.data
}

export const useGetExp = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: getExp,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
