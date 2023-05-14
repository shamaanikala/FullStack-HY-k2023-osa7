import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  console.log(`blogRducer: state: ${JSON.stringify(state)}`, action)
  switch (action.type) {
    //case 'NEW_BLOG':
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

export default blogReducer