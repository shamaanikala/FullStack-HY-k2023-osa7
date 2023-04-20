import { useState } from "react"

const Blog = ({ user, blog, like, remove }) => {

  const [blogOpen, setBlogOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // :hover voisi tehdä tämän avulla
  // https://stackoverflow.com/questions/32125708/how-can-i-access-a-hover-state-in-reactjs
  const blogTitle = {
    //hover: 'underline'
    //fontSize: 13
  }

  const anonymousStyle = {
    color: 'grey',
    fontStyle: 'italic'
  }

  // klikattavan tekstin idea tämän perusteella:
  // https://stackoverflow.com/questions/43630991/by-clicking-text-how-to-change-clicked-text-to-another-text-in-react-js
  // eli luultavasti melkein mihin tahansa tagiin voi lisätä onClick()

  const toggleBlog = () => {
    setBlogOpen(!blogOpen)
  }

  return (
    <div style={blogStyle}>
      {!blogOpen &&
      <div>
        <span onClick={toggleBlog}>{blog.title} {blog.author}</span>
          <button onClick={toggleBlog}>view</button> 
      </div>}
      {blogOpen &&
      <div>
        <span onClick={toggleBlog} style={blogTitle}>{blog.title} {blog.author}</span>
          <button onClick={toggleBlog}>hide</button>
          <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
          <div>likes {blog.likes} <button onClick={() => like(blog.id)}>like</button></div>
          {!blog.user && <span style={anonymousStyle}>Anonymous</span>}
          {blog.user && <span>{blog.user.name}</span>}
          {(!blog.user || user.username === blog.user.username) && <div><button onClick={() => remove(blog.id)}>remove</button></div>}
      </div>
      }
    </div>
  )
}

export default Blog