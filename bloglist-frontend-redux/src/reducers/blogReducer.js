import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  // console.log(`blogRducer: state: ${JSON.stringify(state)}`, action)
  console.log(`blogReducer: type: ${action.type}`)
  switch (action.type) {
    case 'NEW_BLOG':
      //console.log([...state, action.payload])
      return [...state, action.payload]
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
  console.log('appendBlogs', newBlog)
  console.log('lähetetään', newBlog)
  const addedBlog = await blogService.get(
    (
      await blogService.create(newBlog)
    ).id
  )
  console.log('addedBlog', addedBlog)
  dispatch({
    type: 'NEW_BLOG',
    payload: addedBlog,
  })
}

export default blogReducer
