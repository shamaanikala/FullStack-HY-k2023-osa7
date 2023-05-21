import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'LIKE_BLOG': {
      const liked = action.payload
      return state.map(b => (b.id !== liked.id ? b : liked))
    }
    case 'REMOVE_BLOG':
      return state.filter(blog => blog.id !== action.payload)
    case 'SET_BLOGS':
      return action.payload
    default:
      return state
  }
}

// HUOM! kaksi nuolta, jotta tulee return
// https://redux.js.org/usage/writing-logic-thunks#writing-thunks
export const initializeBlogs = () => async dispatch => {
  // console.log('initializeBlogs')
  const blogs = await blogService.getAll().catch(error => {
    console.log(error)
    console.log(`Unable to initialize blog data: ${JSON.stringify(error.response)}`)
  })
  try {
    dispatch({
      type: 'SET_BLOGS',
      payload: blogs,
    })
  } catch (exception) {
    console.log(exception)
  }
}

export const addBlog = newBlog => async dispatch => {
  const response = await blogService.create(newBlog)
  const addedBlog = await blogService.get(response.id)
  dispatch({
    type: 'NEW_BLOG',
    payload: addedBlog,
  })
}

export const likeBlog = (id, targetBlog) => async dispatch => {
  await blogService.like(id, targetBlog).catch(error => {
    // console.error('likeBlog', error)
    if (error.response.status === 404) {
      dispatch(initializeBlogs())
    }
    throw error
  })
  const likedBlog = await blogService.get(id)
  dispatch({
    type: 'LIKE_BLOG',
    payload: likedBlog,
  })
}

export const removeBlog = id => async dispatch => {
  await blogService.remove(id).catch(error => {
    if (error.response.status === 404) {
      dispatch(initializeBlogs())
    }
    throw error
  })
  dispatch({
    type: 'REMOVE_BLOG',
    payload: id,
  })
}

export default blogReducer
