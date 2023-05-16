import { useQuery } from 'react-query'
import usersService from '../services/users'
import { Link, useMatch } from 'react-router-dom'

const UsersTable = ({ users }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td></td>
          <td>
            <b>blogs created</b>
          </td>
        </tr>
        {users.map(user => (
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
  const users = result.data
  const match = useMatch('/user/:id')
  console.log('match:', match)
  // console.log('match.params.id:', match.params.id)
  // const user = match && result.isSuccess ? users.find(user => user.id === match.params.id) : null

  return (
    <div>
      <h2>Users 😸</h2>
      {result.isLoading && <div>loading...</div>}
      {result.isSuccess && (
        <>
          <UsersTable users={users} />
        </>
      )}
    </div>
  )
}

export default Users
