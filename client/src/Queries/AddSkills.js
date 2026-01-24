import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addSkills = async data => {
  const res = await api.post('/skill/add', data)
  return res.data
}

export const useAddSkills = () => {
  return useMutation({
    mutationFn: addSkills,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}
