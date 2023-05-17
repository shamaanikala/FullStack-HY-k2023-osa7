import { Routes, Route, useMatch } from 'react-router-dom'
import Blogs from './Blogs'
import Users from './Users'
import User from './User'
import BlogView from './BlogView'
import { useUsers } from '../hooks/useUsers'
import { useBlogs } from '../hooks/useBlogs'

const AppRouter = () => {
  const users = useUsers()
  const blogs = useBlogs().blogs

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  const user = users.query.isSuccess
    ? userMatch
      ? users.data.find(user => user.id === userMatch.params.id)
      : null
    : null

  const blog = blogMatch ? blogs.find(blog => blog.id === blogMatch.params.id) : null

  return (
    <Routes>
      <Route path="/" element={<Blogs />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User user={user} />} />
      <Route path="/blogs/:id" element={<BlogView blog={blog} />} />
    </Routes>
  )
}

export default AppRouter
