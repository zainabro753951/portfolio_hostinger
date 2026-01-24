import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addService = async data => {
  const response = await api.post(`/service/add`, data)
  return response.data
}

export const useAddServices = () => {
  return useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
