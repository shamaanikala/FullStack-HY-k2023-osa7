import { useEffect } from 'react'
import './index.css'

import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'

import { Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import LoginHeader from './components/LoginHeader'
import Header from './components/Header'
import { useAuth } from './hooks/useAuth'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const auth = useAuth()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

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
