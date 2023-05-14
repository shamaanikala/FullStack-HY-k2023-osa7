import { createStore, combineReducers } from 'redux'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  blogs: blogReducer,
})

const store = createStore(reducer)

export default store
