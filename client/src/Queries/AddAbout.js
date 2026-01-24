import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addAboutFunc = async data => {
  const response = await api.post(`/about/add`, data)
  return response.data
}

export const useAddAbout = () => {
  return useMutation({
    mutationFn: addAboutFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
