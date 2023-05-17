import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification, hideNotification, showError } from '../reducers/notificationReducer'
import { addBlog, likeBlog, removeBlog } from '../reducers/blogReducer'

const Blogs = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  const sortByTitle = (a, b) => {
    const title_a = a.title.toUpperCase()
    const title_b = b.title.toUpperCase()
    return title_a < title_b ? -1 : title_a > title_b ? 1 : 0
  }

  const blogs = useSelector(state =>
    state.blogs.sort(sortByTitle).sort((a, b) => b.likes - a.likes)
  )

  const createBlog = async blogObject => {
    try {
      const newBlog = { ...blogObject }
      dispatch(showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 5000))
      await dispatch(addBlog(blogObject))
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log('Adding new blog failed')
      console.log(exception)
      dispatch(hideNotification(true)) // params: force
      dispatch(showError(`Failed to add a new blog: ${exception}`))
      if (exception.response.data.error) {
        dispatch(showError(`Failed to add a new blog: ${exception.response.data.error}`))
      } else {
        dispatch(showError(`Failed to add a new blog: ${exception}`))
      }
      throw exception
    }
  }

  const handleLike = async id => {
    try {
      const blog = blogs.find(b => b.id === id)
      const likedBlog = { ...blog }

      // näytetään alustava notifikaatio
      dispatch(showNotification(`${user.name} liked the blog ${likedBlog.title}!`, 5000))
      await dispatch(likeBlog(id, likedBlog))
      dispatch(showNotification(`${user.name} liked the blog ${likedBlog.title}! 👍`))
    } catch (exception) {
      console.log('Liking blog failed')
      // pakotetaan tykkäysilmoitus piiloon force=true
      dispatch(hideNotification(true)) // params: force
      console.log(exception)
      if (exception.response.data.error) {
        dispatch(showError(`Failed to like blog: ${exception.response.data.error}`))
      } else if (exception.response.status === 404) {
        dispatch(showError('Blog was already removed from the server'))
      } else {
        dispatch(showError(`Failed to like blog: ${exception}`))
      }
    }
  }

  const handleRemove = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      try {
        console.log(`Yritetään poistaa blogi ${id}`)
        await dispatch(removeBlog(id))
        dispatch(showNotification(`Removed the blog ${title}`))
      } catch (exception) {
        console.log(exception)
        if (exception.response.data.error) {
          dispatch(showError(`Failed to remove blog: ${exception.response.data.error}`))
        } else if (exception.response.status === 404) {
          dispatch(showError('Blog was already removed from the server'))
        } else {
          dispatch(showError(`Failed to remove blog: ${exception}`))
        }
      }
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
