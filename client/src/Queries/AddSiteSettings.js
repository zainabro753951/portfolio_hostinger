import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addSiteSettings = async data => {
  const res = await api.post('/site-settings/add', data)
  return res.data
}

export const useAddSiteSettings = () => {
  return useMutation({
    mutationFn: addSiteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] })
    },
  })
}
