// import { useParams } from 'react-router-dom'
// import { useQuery } from 'react-query'
// import usersService from '../services/users'

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

const User = ({ user }) => {
  if (!user) {
    return <div>loading user information...</div>
  }

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
