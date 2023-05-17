import './index.css'
import { useSelector } from 'react-redux'
import LoginHeader from './components/LoginHeader'
import Header from './components/Header'
import { useAuth } from './hooks/useAuth'
import { useBlogs } from './hooks/useBlogs'
import AppRouter from './components/AppRouter'
import { useQueryClient } from 'react-query'

const App = () => {
  const user = useSelector(state => state.user)
  const auth = useAuth()
  const blogs = useBlogs()

  auth.useCheckLoggedUser() // onko käyttäjä kirjautunut sisään localStoragessa?
  blogs.useBlogsInit()

  const queryClient = useQueryClient()

  queryClient.invalidateQueries('comments')

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
