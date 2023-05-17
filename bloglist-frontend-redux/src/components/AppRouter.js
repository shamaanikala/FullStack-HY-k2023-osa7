import { Routes, Route, useMatch } from 'react-router-dom'
import Blogs from './Blogs'
import Users from './Users'
import User from './User'
import { useUsers } from '../hooks/useUsers'

const AppRouter = () => {
  const users = useUsers()
  const match = useMatch('/users/:id')

  const user = users.query.isSuccess
    ? match
      ? users.data.find(user => user.id === match.params.id)
      : null
    : null

  return (
    <Routes>
      <Route path="/" element={<Blogs />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User user={user} />} />
    </Routes>
  )
}

export default AppRouter
