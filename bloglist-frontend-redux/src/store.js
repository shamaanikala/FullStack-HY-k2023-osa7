import { createStore, combineReducers } from 'redux'
import notificationReducer from './reducers/notificationReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  // blogs:
})

const store = createStore(reducer)

export default store
