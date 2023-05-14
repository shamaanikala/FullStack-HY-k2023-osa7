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
  // const addedBlog = await blogService.get(
  //   (
  //     await blogService.create(newBlog)
  //   ).id
  // )
  dispatch({
    type: 'NEW_BLOG',
    payload: addedBlog,
  })
}

export const likeBlog = (id, targetBlog) => async dispatch => {
  const response = await blogService.like(id, targetBlog)
  console.log(`likeBlog dispatching: ${response}`)
  dispatch({
    type: 'LIKE_BLOG',
    payload: response,
  })
}

export default blogReducer
