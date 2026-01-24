import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { queryClient } from '../queryClient'

const addPricePlan = async data => {
  const res = await api.post('/price-plan/add', data)
  return res.data
}

export const useAddPricePlan = () => {
  return useMutation({
    mutationFn: addPricePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricePlan'] })
    },
  })
}
