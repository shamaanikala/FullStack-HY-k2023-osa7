import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
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
} from './reducers/notificationReducer'

// tämä App ulkopuolelle, ettei valiteta
// React Hook useEffect has a missing dependency: 'logout'. Either include it or remove the dependency array
// t. https://overreacted.io/a-complete-guide-to-useeffect/
const logout = setUser => {
  if (window.localStorage.getItem('loggedBloglistUser')) {
    // if (user) {
    //   console.log(`Löydettiin kirjautunut käyttäjä ${user.username}`)
    // }
    window.localStorage.removeItem('loggedBloglistUser')
  }
  setUser(null)
  console.log('Käyttäjä kirjattu ulos')
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const blogFormRef = useRef()

  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch()
  const notificationReducerMessage = useSelector(state => state.message)
  const errorMessage = useSelector(state => state.errorMessage)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

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
          setUser(user)
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      console.log('wrong credentials')
      dispatch(setError('wrong username or password'))
      // setErrorMessage('wrong username or password')
      setTimeout(() => {
        // setErrorMessage(null)
        dispatch(hideError())
      }, 5000)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    logout(setUser)
    setNotificationMessage('user logged out')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 1500)
  }

  const createBlog = async blogObject => {
    try {
      const newBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      console.log(newBlog)
      console.log(
        `Kun uusi blogi on lisätty, on blogin user kenttä ${newBlog.user}`
      )
      // ei vain lisätä uutta blogia listaan, vaan kutsutaan backendin get / kautta sitä, jotta populate tapahtuu
      // ja blogin user-kentän id yhdistetään käyttäjän tietoihin
      //setBlogs(blogs.concat(newBlog))

      setNotificationMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )

      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)

      // laitetaan tämä tänne. Menee ehkä hieman enemmän aikaa kuin 5 sekuntia, koska em. tietokantaoperaatiot vievät aikaa
      // riittäisikö vähemmän kuin 5000 ms ?
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log('Adding new blog failed')
      console.log(exception)
      if (exception.response.data.error) {
        //setErrorMessage(
        dispatch(
          setError(`Failed to add a new blog: ${exception.response.data.error}`)
        )
      } else {
        dispatch(setError(`Failed to add a new blog: ${exception}`))
        // setErrorMessage(`Failed to add a new blog: ${exception}`)
      }
      setTimeout(() => {
        dispatch(hideError())
        // setErrorMessage(null)
      }, 5000)
      throw exception
    }
  }

  // otetaan mallia notes toggleImportanceOf
  const likeBlog = async id => {
    try {
      const blog = blogs.find(b => b.id === id)
      const likedBlog = { ...blog, likes: blog.likes + 1 }

      // tähän jo tykkäysviestin dispatch
      dispatch(
        setNotification(`${user.name} liked the blog ${likedBlog.title}!`)
      )
      const result = await blogService.like(id, likedBlog)
      setBlogs(await blogService.getAll())
      // tällä tavalla tulee bugi, jossa lisääjän nimi ei näy
      //setBlogs(blogs.map(b => b.id !== id ? b : result))
      dispatch(
        setNotification(`${user.name} liked the blog ${result.title}! 👍`)
      )
      //setNotificationMessage(`${user.name} liked the blog ${result.title}!`)
      setTimeout(() => {
        //setNotificationMessage(null)
        dispatch(hideNotification())
      }, 5000)
    } catch (exception) {
      console.log('Liking blog failed')
      console.log('piilotetaan redux notifikaatio')
      dispatch(hideNotification())
      console.log(exception)
      if (exception.response.data.error) {
        dispatch(
          setError(`Failed to like blog: ${exception.response.data.error}`)
        )
        // setErrorMessage(`Failed to like blog: ${exception.response.data.error}`)
      } else if (exception.response.status === 404) {
        dispatch(setError('Blog was already removed from the server'))
        // setErrorMessage('Blog was already removed from the server')
        setBlogs(await blogService.getAll())
      } else {
        dispatch(setError(`Failed to like blog: ${exception}`))
        // setErrorMessage(`Failed to like blog: ${exception}`)
      }
      setTimeout(() => {
        dispatch(hideError())
        // setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      try {
        console.log(`Yritetään poistaa blogi ${id}`)
        const result = await blogService.remove(id)

        setBlogs(await blogService.getAll())

        setNotificationMessage(`Removed the blog ${result}`)

        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      } catch (exception) {
        console.log(exception)
        if (exception.response.data.error) {
          dispatch(
            setError(`Failed to remove blog: ${exception.response.data.error}`)
          )
          // setErrorMessage(
          //   `Failed to remove blog: ${exception.response.data.error}`
          // )
        } else if (exception.response.status === 404) {
          dispatch(setError('Blog was already removed from the server'))
          // setErrorMessage('Blog was already removed from the server')
          setBlogs(await blogService.getAll())
        } else {
          dispatch(setError(`Failed to remove blog: ${exception}`))
          // setErrorMessage(`Failed to remove blog: ${exception}`)
        }
        setTimeout(() => {
          dispatch(hideError())
          // setErrorMessage(null)
        }, 5000)
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
          <Notification message={errorMessage} type={'error'} />
          <Notification message={notificationMessage} type={'blogAdded'} />
          <Notification
            message={notificationReducerMessage}
            type={'blogAdded'}
          />
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
                  like={likeBlog}
                  remove={removeBlog}
                />
              ))
          }
        </div>
      )}
    </div>
  )
}

export default App
