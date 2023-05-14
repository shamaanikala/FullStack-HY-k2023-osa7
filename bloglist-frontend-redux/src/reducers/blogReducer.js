import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  console.log(`blogReducer: type: ${action.type}`)
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
  console.log('initializeBlogs')
  const blogs = await blogService.getAll()

  dispatch({
    type: 'SET_BLOGS',
    payload: blogs,
  })
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
  await blogService.like(id, targetBlog)
  const likedBlog = await blogService.get(id)
  dispatch({
    type: 'LIKE_BLOG',
    payload: likedBlog,
  })
}

export const removeBlog = id => async dispatch => {
  const response = await blogService.remove(id)
  console.log('blogReducer.removeBlog', id, response)
  dispatch({
    type: 'REMOVE_BLOG',
    payload: id,
  })
}

export default blogReducer
