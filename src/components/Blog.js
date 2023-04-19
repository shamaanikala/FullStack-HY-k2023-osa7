import { useState } from "react"

const Blog = ({ blog }) => {

  const [blogOpen, setBlogOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
        <span onClick={toggleBlog}>{blog.title} {blog.author}</span>
          <button onClick={toggleBlog}>hide</button>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={() => console.log(`blogin ${blog.title} like-nappulaa painettu`)}>like</button></div>
          {blog.user ? <span>{blog.user.name}</span> : <span style={anonymousStyle}>Anonymous</span>}
      </div>
      }
    </div>
  )
}

export default Blog