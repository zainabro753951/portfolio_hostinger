import api from '../api/axios'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../queryClient.js'

const addExp = async data => {
  const res = await api.post('/experience/add', data)
  return res.data
}

export const useAddExperience = () => {
  return useMutation({
    mutationFn: addExp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}
