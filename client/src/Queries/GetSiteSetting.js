import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

const getSiteSettings = async () => {
  const res = await api.get('/site-settings/get')
  return res.data
}

export const useGetSiteSettingsQuery = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: getSiteSettings,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
