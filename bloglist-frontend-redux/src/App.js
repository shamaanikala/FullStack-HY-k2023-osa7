import { useEffect } from 'react'
import blogService from './services/blogs' // token tulee myös täältä vielä!
import loginService from './services/login'
import './index.css'
import Notification from './components/Notification'
import Logout from './components/Logout'

import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

import { setUser } from './reducers/userReducer'

import { Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import LoginHeader from './components/LoginHeader'

const App = () => {
  const dispatch = useDispatch()
  const notificationMessage = useSelector(state => state.notification.messages[0])
  const errorMessage = useSelector(state => state.notification.errorMessages[0])

  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // tämän useEffectin sisältö services/login/verify.js ?
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const verifyUserToken = async () => {
        const user = JSON.parse(loggedUserJSON)
        //console.log(`Tehdään verify ${user.username} ${user.token}`)
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
      verifyUserToken()
    }
  }, [])

  const logout = setUser => {
    if (window.localStorage.getItem('loggedBloglistUser')) {
      window.localStorage.removeItem('loggedBloglistUser')
    }
    dispatch(setUser(null))
    console.log('Käyttäjä kirjattu ulos')
  }

  const handleLogout = event => {
    event.preventDefault()
    logout(setUser)
    dispatch(showNotification('user logged out', 1500))
  }

  return (
    <div>
      {!user && <LoginHeader />}
      {user && (
        <div>
          <h2>blogs</h2>
          <div className="notificationBox">
            <Notification message={errorMessage} type={'error'} />
            <Notification message={notificationMessage} type={'blogAdded'} />
          </div>
          <p>
            {user.name} logged in <Logout handleLogout={handleLogout} />
          </p>
          <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
