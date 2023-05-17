import './index.css'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import LoginHeader from './components/LoginHeader'
import Header from './components/Header'
import { useAuth } from './hooks/useAuth'
import { useBlogs } from './hooks/useBlogs'
import { useUsers } from './hooks/useUsers'

const App = () => {
  const user = useSelector(state => state.user)
  const auth = useAuth()

  const blogs = useBlogs()
  const users = useUsers()

  users.query.isSuccess ? console.log(users.data) : console.log('loading users data...')

  blogs.initBlogs()
  auth.checkLoggedUser() // onko käyttäjä kirjautunut sisään localStoragessa?

  return (
    <div>
      {!user && <LoginHeader />}
      {user && (
        <div>
          <Header />
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
