import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addEducation = async data => {
  const res = await api.post('/education/add', data)
  return res.data
}

export const useAddEducation = () => {
  return useMutation({
    mutationFn: addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] })
    },
  })
}
