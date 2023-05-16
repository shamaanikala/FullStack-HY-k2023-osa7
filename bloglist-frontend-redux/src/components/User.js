import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import usersService from '../services/users'

const User = () => {
  const id = useParams().id
  const result = useQuery(
    'users',
    () => usersService.getAll().then(res => res) // getAll antaa .data
  )
  console.log(result)
  const user = result.data.find(user => user.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <div>
        <ul>
          <li>Blog title</li>
        </ul>
      </div>
    </div>
  )
}

export default User
