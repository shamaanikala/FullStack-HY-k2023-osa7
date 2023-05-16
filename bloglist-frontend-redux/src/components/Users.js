import { useQuery } from 'react-query'
import usersService from '../services/users'

const Users = () => {
  // dummy dataa
  // const userData = [
  //   { name: 'Arto Hellas', aggregatedBlogNumber: 6 },
  //   { name: 'Matti Luukkainen', aggregatedBlogNumber: 2 },
  //   { name: 'Venla Ruuska', aggregatedBlogNumber: 0 },
  // ]

  const result = useQuery(
    'users',
    () => usersService.getAll().then(res => res) // getAll antaa .data
  )
  console.log(result)

  return (
    <div>
      <h2>Users 😸</h2>
      {result.isLoading && <div>loading...</div>}
      {result.isSuccess && (
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
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Users
