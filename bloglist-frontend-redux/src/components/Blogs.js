import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { showNotification, hideNotification, showError } from '../reducers/notificationReducer'
import { addBlog } from '../reducers/blogReducer'

const Blogs = ({ blogs, handleLike, handleRemove, user }) => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const createBlog = async blogObject => {
    try {
      const newBlog = { ...blogObject }
      dispatch(showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 5000))
      await dispatch(addBlog(blogObject))
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log('Adding new blog failed')
      console.log(exception)
      dispatch(hideNotification(null, true)) // params: timeoutId, force
      dispatch(showError(`Failed to add a new blog: ${exception}`))
      if (exception.response.data.error) {
        dispatch(showError(`Failed to add a new blog: ${exception.response.data.error}`))
      } else {
        dispatch(showError(`Failed to add a new blog: ${exception}`))
      }
      throw exception
    }
  }

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
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
