import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Logout from './components/Logout'


// tämä App ulkopuolelle, ettei valiteta
// React Hook useEffect has a missing dependency: 'logout'. Either include it or remove the dependency array
// t. https://overreacted.io/a-complete-guide-to-useeffect/
const logout = (setUser) => {
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
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const verifyUserToken = async () => {
        const user = JSON.parse(loggedUserJSON)
        //console.log(`Tehdään verify ${user.username} ${user.token}`)
        const token = `Bearer ${user.token}`
        const config = {
          headers: { Authorization: token}
        }
        try {
          await loginService.verify(
            { username: user.username },config)
          setUser(user)
          blogService.setToken(user.token)
        } catch(exception) {
          console.log(exception)
          // jos huomataan huono token, poistetaan se localStoragesta
          logout(setUser)
        }
      }
      verifyUserToken()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      console.log(exception)
      console.log('wrong credentials')
      setErrorMessage(
        `wrong username or password`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  

  const handleLogout = (event) => {
    event.preventDefault()
    logout(setUser)
    setNotificationMessage(`user logged out`)
    setTimeout(() => {
      setNotificationMessage(null)
    },1500)
  }

  const createBlog = async blogObject => {
    try {
      const newBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      console.log(newBlog)
      setBlogs(blogs.concat(newBlog))
      setNotificationMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log('Adding new blog failed')
      console.log(exception)
      if (exception.response.data.error) {
        setErrorMessage(`Failed to add a new blog: ${exception.response.data.error}`)
      } else {
        setErrorMessage(`Failed to add a new blog: ${exception}`)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)   
    }
  }

  return (
    <div>
      {!user && <div>
        <Notification
          message={notificationMessage}
          type={'logout'}
        />
        <h2>log in to application</h2>
        <Notification
          message={errorMessage}
          type={'error'}
        />
        <LoginForm 
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
        </div>}
      {user && <div>
      <h2>blogs</h2>
      <Notification
        message={errorMessage}
        type={'error'}
      />
      <Notification
          message={notificationMessage}
          type={'blogAdded'}
         />
      <p>{user.name} logged in <Logout handleLogout={handleLogout} /></p>
      
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
    </div>
  )
}

export default App