import './index.css'
import { useSelector } from 'react-redux'
import LoginHeader from './components/LoginHeader'
import Header from './components/Header'
import { useAuth } from './hooks/useAuth'
import { useBlogs } from './hooks/useBlogs'
import AppRouter from './components/AppRouter'

const App = () => {
  const user = useSelector(state => state.user)
  const auth = useAuth()
  const blogs = useBlogs()

  auth.checkLoggedUser() // onko käyttäjä kirjautunut sisään localStoragessa?
  blogs.initBlogs()

  return (
    <div>
      {!user && <LoginHeader />}
      {user && (
        <div>
          <Header />
          <AppRouter />
        </div>
      )}
    </div>
  )
}

export default App
