import { useEffect } from 'react'
import loginService from '../services/login'
import { setUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'

export const useAuth = () => {
  // oman hookin sisällä voi kutsua hookia!
  const dispatch = useDispatch()

  const verifyUserToken = async loggedUserJSON => {
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
      logout(setUser)
    }
  }

  const useCheckLoggedUser = () => {
    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
      if (loggedUserJSON) {
        verifyUserToken(loggedUserJSON)
      }
    }, [])
  }

  const logout = setUser => {
    if (window.localStorage.getItem('loggedBloglistUser')) {
      window.localStorage.removeItem('loggedBloglistUser')
    }
    dispatch(setUser(null))
    console.log('Käyttäjä kirjattu ulos')
  }

  return {
    useCheckLoggedUser,
    logout,
  }
}
