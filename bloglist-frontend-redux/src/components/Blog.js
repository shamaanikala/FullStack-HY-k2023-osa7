import { useState } from 'react'
import { Link } from 'react-router-dom'

const blogTitle = {
  textDecoration: 'underline',
  fontWeight: 'bold',
}

const BlogTitle = ({ blog, toggleBlog, blogOpen }) => {
  return (
    <>
      <span onClick={toggleBlog} style={blogTitle} className="blogTitle">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </span>{' '}
      <span className="blogAuthor"> {blog.author}</span>
      {!blogOpen && (
        <button id="viewBlogButton" onClick={toggleBlog}>
          view
        </button>
      )}
      {blogOpen && <button onClick={toggleBlog}>hide</button>}
    </>
  )
}

const Blog = ({ user, blog, like, remove }) => {
  const [blogOpen, setBlogOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    width: 'fit-content',
    minWidth: '75%',
    marginTop: 5,
    borderRadius: 5,
  }

  const opened = {
    marginLeft: 5,
    marginBottom: 5,
  }

  const anonymousStyle = {
    color: 'grey',
    fontStyle: 'italic',
  }

  // klikattavan tekstin idea tämän perusteella:
  // https://stackoverflow.com/questions/43630991/by-clicking-text-how-to-change-clicked-text-to-another-text-in-react-js
  // eli luultavasti melkein mihin tahansa tagiin voi lisätä onClick()

  const toggleBlog = () => {
    setBlogOpen(!blogOpen)
  }

  return (
    <div className="blogBox" style={blogStyle}>
      {!blogOpen && (
        <div className="closed">
          <BlogTitle blog={blog} toggleBlog={toggleBlog} blogOpen={blogOpen} />
        </div>
      )}
      {blogOpen && (
        <div className="opened" style={opened}>
          <BlogTitle blog={blog} toggleBlog={toggleBlog} blogOpen={blogOpen} />
          <div className="blogUrl">
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </div>
          <div>
            likes <span id="likes">{blog.likes}</span>{' '}
            <button className="likeBUtton" onClick={() => like(blog.id)}>
              like
            </button>
          </div>
          {!blog.user && <span style={anonymousStyle}>Anonymous</span>}
          {blog.user && <span className="blogUser">{blog.user.name}</span>}
          {(!blog.user || user.username === blog.user.username) && (
            <div className="removeDiv">
              <button
                className="removeButton"
                onClick={() => remove(blog.id, blog.title, blog.author)}
              >
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
