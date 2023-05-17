import { Routes, Route } from 'react-router-dom'
import Blogs from './Blogs'
import Users from './Users'
import User from './User'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Blogs />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User />} />
    </Routes>
  )
}

export default AppRouter
