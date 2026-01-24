import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const submitProjectRes = async formData => {
  const projectId = formData.get('projectId')
  const response = await api.post(`/project/add/${projectId || ''}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const mutateProject = () => {
  return useMutation({
    mutationFn: submitProjectRes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
