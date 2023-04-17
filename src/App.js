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

const CreateNewForm = ({ handleCreateNew, title, setTitle, author, setAuthor, url, setUrl }) => {
  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateNew}>
        <div>
          title:
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const Logout = ({ handleLogout }) => {
  return (
    <button type="submit" onClick={handleLogout}>logout</button>
  )
}

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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

    //console.log('Login käyntiin')
    try {
      const user = await loginService.login({
        username, password
      })
      //console.log(`${username} kirjautumassa`)
      //console.log(`token: ${user.token}`)
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      console.log('wrong credentials')
    }
  }

  

  const handleLogout = (event) => {
    event.preventDefault()

    // if (window.localStorage.getItem('loggedBloglistUser')) {
    //   console.log(`Löydettiin kirjautunut käyttäjä ${user.username}`)
    //   window.localStorage.removeItem('loggedBloglistUser')
    // }
    // setUser(null)
    // console.log('Käyttäjä kirjattu ulos')
    logout(setUser)
  }

  const handleCreateNew = async (event) => {
    event.preventDefault()

    // console.log(`create painettu, lähetetään uusi blogi:`)
    // console.log(`title: ${title}`)
    // console.log(`author: ${author}`)
    // console.log(`url: ${url}`)

    const blogObject = { title, author, url }
    // console.log(blogObject)
    try {
      const newBlog = await blogService
        .create(blogObject)

      //console.log('uusi blogi tehty')
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.log('Adding new blog failed')
      console.log(exception)
    }
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
      
      <CreateNewForm
        handleCreateNew={handleCreateNew}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
      />
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
    </div>
  )
}

export default App