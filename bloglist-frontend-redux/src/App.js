import { useState, useEffect } from 'react'
import blogService from './services/blogs' // token tulee myös täältä vielä!
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LoginForm.js'
import Notification from './components/Notification'
import Logout from './components/Logout'

import { useDispatch, useSelector } from 'react-redux'
import { showNotification, showError } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

import { setUser } from './reducers/userReducer'

import { Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const notificationMessage = useSelector(state => state.notification.messages[0])
  const errorMessage = useSelector(state => state.notification.errorMessages[0])

  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

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

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      console.log('wrong credentials')
      dispatch(showError('wrong username or password'))
    }
  }

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
      {!user && (
        <div>
          <Notification message={notificationMessage} type={'logout'} />
          <h2>log in to application</h2>
          <Notification message={errorMessage} type={'error'} />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      )}
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
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
