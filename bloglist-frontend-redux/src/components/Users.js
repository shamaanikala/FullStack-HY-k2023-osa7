import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'

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
  const users = useUsers()

  return (
    <div>
      <h2>Users 😸</h2>
      {users.query.isLoading && <div>loading...</div>}
      {users.query.isSuccess && (
        <>
          <UsersTable users={users.data} />
        </>
      )}
    </div>
  )
}

export default Users
