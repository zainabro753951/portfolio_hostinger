// hooks/usePageVisit.js
import { useAddVisitors } from '../Queries/AddVisitors'

export const usePageVisit = () => {
  const { mutate, isError, error } = useAddVisitors()

  const pageVisit = page => {
    mutate({ page })

    if (isError) {
      console.log('====================================')
      console.log(error)
      console.log('====================================')
    }
  }

  return pageVisit
}
