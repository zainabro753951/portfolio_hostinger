import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addVisitors = async data => {
  const res = await api.post('/add/visitors', data)
  return res.data
}

export const useAddVisitors = () => {
  return useMutation({
    mutationFn: addVisitors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
    },
  })
}
