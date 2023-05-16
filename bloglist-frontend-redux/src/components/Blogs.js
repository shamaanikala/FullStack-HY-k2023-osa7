import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

const Blogs = ({ blogs, handleLike, handleRemove, user, createBlog, ref }) => {
  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={ref}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#creating_displaying_and_sorting_an_array
        // listan järjestämisen vertailufunktio tuon avulla
        blogs.map(blog => (
          <Blog key={blog.id} user={user} blog={blog} like={handleLike} remove={handleRemove} />
        ))
      }
    </div>
  )
}

export default Blogs
