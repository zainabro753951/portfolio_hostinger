import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { useSelector } from 'react-redux'

const getMessage = async () => {
  const res = await api.get('/message/get')
  return res.data
}

export const useGetMessage = () => {
  const { isAuth } = useSelector(state => state.adminAuth)
  return useQuery({
    queryKey: ['contactMessages'],
    queryFn: getMessage,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  })
}
