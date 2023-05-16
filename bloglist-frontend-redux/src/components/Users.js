import { useQuery } from 'react-query'
import usersService from '../services/users'
import { Link } from 'react-router-dom'

const UsersTable = ({ result }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td></td>
          <td>
            <b>blogs created</b>
          </td>
        </tr>
        {result.data.map(user => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Users = () => {
  const result = useQuery(
    'users',
    () => usersService.getAll().then(res => res) // getAll antaa .data
  )
  console.log(result)

  return (
    <div>
      <h2>Users 😸</h2>
      {result.isLoading && <div>loading...</div>}
      {result.isSuccess && <UsersTable result={result} />}
    </div>
  )
}

export default Users
