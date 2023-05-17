import { Link } from 'react-router-dom'

const BlogTitleList = ({ blogs }) => {
  return (
    <>
      <ul>
        {blogs.map(blog => (
          <li key={blog.title}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BlogTitleList
