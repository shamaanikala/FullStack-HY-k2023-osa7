import { useQuery } from 'react-query'
import usersService from '../services/users'

export const useUsers = () => {
  const query = useQuery(
    'users',
    () => usersService.getAll().then(res => res) // getAll antaa .data
  )

  const data = query.isLoading ? null : query.isSuccess ? query.data : null

  return {
    query,
    data,
  }
}
