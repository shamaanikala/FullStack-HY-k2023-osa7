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

  return {
    blogs,
    initBlogs,
  }
}
