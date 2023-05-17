import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from '../reducers/blogReducer'
import { showNotification, hideNotification, showError } from '../reducers/notificationReducer'
import { likeBlog } from '../reducers/blogReducer'

export const useBlogs = () => {
  const dispatch = useDispatch()

  // annetaan tämän kautta Routerille blogit
  const blogs = useSelector(state => state.blogs) // tuskin tarvitsee sort tässä

  const initBlogs = () => {
    useEffect(() => {
      dispatch(initializeBlogs())
    }, [dispatch])
  }

  const sortByTitle = (a, b) => {
    const title_a = a.title.toUpperCase()
    const title_b = b.title.toUpperCase()
    return title_a < title_b ? -1 : title_a > title_b ? 1 : 0
  }

  const blogsSorted = useSelector(state =>
    state.blogs.sort(sortByTitle).sort((a, b) => b.likes - a.likes)
  )

  const handleLike = async (id, user) => {
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

  return {
    blogs,
    initBlogs,
    blogsSorted,
    handleLike,
  }
}
