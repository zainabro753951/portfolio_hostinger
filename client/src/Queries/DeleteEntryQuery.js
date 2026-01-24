// src/Queries/useDeleteEntry.js
import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const deleteEntry = async ({ route, ids }) => {
  if (!route) throw new Error('Route is required for delete request')

  if (Array.isArray(ids) && ids.length > 0) {
    // 🔥 multiple delete
    const res = await api.post(`${route}`, { ids })
    return res.data
  } else {
    // 🧩 single delete
    const res = await api.delete(route)
    return res.data
  }
}

export const useDeleteEntry = (...queryKey) => {
  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      if (queryKey?.length) queryClient.invalidateQueries({ queryKey })
    },
  })
}
