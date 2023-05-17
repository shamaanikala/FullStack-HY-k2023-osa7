import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from '../reducers/blogReducer'

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

  return {
    blogs,
    initBlogs,
    blogsSorted,
  }
}
