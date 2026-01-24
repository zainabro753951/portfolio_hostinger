import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { useSelector } from 'react-redux'

const getAbout = async () => {
  const res = await api.get('/about/get')
  return res.data
}

export const useGetAbout = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: getAbout,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
