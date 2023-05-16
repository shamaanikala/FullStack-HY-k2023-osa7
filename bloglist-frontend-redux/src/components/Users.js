// import usersService from '../services/users'

// const getUserData = async () => await usersService.getAll()

const Users = () => {
  // dummy dataa
  const userData = [
    { name: 'Arto Hellas', aggregatedBlogNumber: 6 },
    { name: 'Matti Luukkainen', aggregatedBlogNumber: 2 },
    { name: 'Venla Ruuska', aggregatedBlogNumber: 0 },
  ]

  return (
    <div>
      <h2>Users 😸</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
          {userData &&
            userData.map(user => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.aggregatedBlogNumber}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
