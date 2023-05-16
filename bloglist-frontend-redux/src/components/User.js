import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import usersService from '../services/users'

const BlogTitleList = ({ blogs }) => {
  return (
    <>
      <ul>
        {blogs.map(blog => (
          <li key={blog.title}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

const User = () => {
  const id = useParams().id
  const result = useQuery(
    'users',
    () => usersService.getAll().then(res => res) // getAll antaa .data
  )

  // User sivun uudelleenlatausbugin välttäminen:
  if (!result.data) {
    return null
  }
  const user = result.data.find(user => user.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <div>
        {user.blogs.length === 0 && <em>No blogs added</em>}
        {user.blogs.length > 0 && <BlogTitleList blogs={user.blogs} />}
      </div>
    </div>
  )
}

export default User
