import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return(
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input 
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

const Logout = ({ handleLogout }) => {
  return (
    <button type="submit" onClick={handleLogout}>logout</button>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // TODO Tarkista, että tokeni on kunnollinen ja käyttäjä löytyy
      // oikeasti tietokannasta
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    console.log('Login käyntiin')
    try {
      const user = await loginService.login({
        username, password
      })
      console.log(`${username} kirjautumassa`)
      console.log(`token: ${user.token}`)
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      console.log('wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    if (window.localStorage.getItem('loggedBloglistUser')) {
      console.log(`Löydettiin kirjautunut käyttäjä ${user.username}`)
      window.localStorage.removeItem('loggedBloglistUser')
    }
    setUser(null)
    console.log('Käyttäjä kirjattu ulos')
  }


  return (
    <div>
      {!user && <LoginForm 
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />}
      {user && <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <Logout handleLogout={handleLogout} /></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
    </div>
  )
}

export default App