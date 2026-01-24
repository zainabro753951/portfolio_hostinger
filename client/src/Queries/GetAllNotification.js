import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { useSelector } from 'react-redux'

const getNoti = async () => {
  const res = await api.get('/notification/get')
  return res.data
}

export const useGetNotifications = () => {
  const { isAuth } = useSelector(state => state.adminAuth)
  return useQuery({
    queryKey: ['notification'],
    queryFn: getNoti,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  })
}
