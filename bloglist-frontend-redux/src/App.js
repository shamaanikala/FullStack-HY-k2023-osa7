import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs' // token tulee myös täältä vielä!
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm.js'
import Notification from './components/Notification'
import Logout from './components/Logout'

import { useDispatch, useSelector } from 'react-redux'
import {
  setNotification,
  hideNotification,
  setError,
  hideError,
  setNotificationTimeout,
  setErrorTimeout,
} from './reducers/notificationReducer'
import {
  addBlog,
  initializeBlogs,
  likeBlog,
  removeBlog,
} from './reducers/blogReducer'

import { setUser } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const notificationMessage = useSelector(state => state.notification.message)
  const errorMessage = useSelector(state => state.notification.errorMessage)

  const showNotification = (message, duration = 5000) => {
    dispatch(setNotification(message))
    const timeoutId = setTimeout(
      () => dispatch(hideNotification(timeoutId)),
      duration
    )
    dispatch(setNotificationTimeout(timeoutId))
  }

  const showError = (message, duration = 5000) => {
    dispatch(setError(message))
    const timeoutId = setTimeout(() => dispatch(hideError(timeoutId)), duration)
    dispatch(setErrorTimeout(timeoutId))
  }

  const blogs = useSelector(state => state.blogs)
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
      showError('wrong username or password')
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
    showNotification('user logged out', 1500)
  }

  const createBlog = async blogObject => {
    try {
      const newBlog = { ...blogObject }
      showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        5000
      )
      dispatch(addBlog(blogObject))
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log('Adding new blog failed')
      console.log(exception)
      dispatch(hideNotification(null, true)) // params: timeoutId, force
      showError(`Failed to add a new blog: ${exception}`)
      if (exception.response.data.error) {
        showError(`Failed to add a new blog: ${exception.response.data.error}`)
      } else {
        showError(`Failed to add a new blog: ${exception}`)
      }
      throw exception
    }
  }

  const handleLike = async id => {
    try {
      const blog = blogs.find(b => b.id === id)
      const likedBlog = { ...blog }

      // näytetään alustava notifikaatio
      showNotification(`${user.name} liked the blog ${likedBlog.title}!`, 10000)
      await dispatch(likeBlog(id, likedBlog))
      showNotification(`${user.name} liked the blog ${likedBlog.title}! 👍`)
    } catch (exception) {
      console.log('Liking blog failed')
      // pakotetaan tykkäysilmoitus piiloon force=true
      dispatch(hideNotification(null, true)) // params: timeoutId, force
      console.log(exception)
      if (exception.response.data.error) {
        showError(`Failed to like blog: ${exception.response.data.error}`)
      } else if (exception.response.status === 404) {
        showError('Blog was already removed from the server')
      } else {
        showError(`Failed to like blog: ${exception}`)
      }
    }
  }

  const handleRemove = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      try {
        console.log(`Yritetään poistaa blogi ${id}`)
        await dispatch(removeBlog(id))
        showNotification(`Removed the blog ${title}`)
      } catch (exception) {
        console.log(exception)
        if (exception.response.data.error) {
          showError(`Failed to remove blog: ${exception.response.data.error}`)
        } else if (exception.response.status === 404) {
          showError('Blog was already removed from the server')
        } else {
          showError(`Failed to remove blog: ${exception}`)
        }
      }
    }
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

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>

          {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#creating_displaying_and_sorting_an_array
            // listan järjestämisen vertailufunktio tuon avulla
            blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
                <Blog
                  key={blog.id}
                  user={user}
                  blog={blog}
                  like={handleLike}
                  remove={handleRemove}
                />
              ))
          }
        </div>
      )}
    </div>
  )
}

export default App
