import loginService from './services/login'
import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'

// const dispatch = useDispatch()

const authUtils = () => {}

export const verifyUserToken = async (loggedUserJSON, dispatch) => {
  const user = JSON.parse(loggedUserJSON)
  const token = `Bearer ${user.token}`
  const config = {
    headers: { Authorization: token },
  }
  try {
    await loginService.verify({ username: user.username }, config)
    dispatch(setUser(user))
    blogService.setToken(user.token)
  } catch (exception) {
    console.log(exception)
    // jos huomataan huono token, poistetaan se localStoragesta
    logout(setUser, dispatch)
  }
}

export const logout = (setUser, dispatch) => {
  if (window.localStorage.getItem('loggedBloglistUser')) {
    window.localStorage.removeItem('loggedBloglistUser')
  }
  dispatch(setUser(null))
  console.log('Käyttäjä kirjattu ulos')
}

export default authUtils
