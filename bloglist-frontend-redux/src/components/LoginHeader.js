import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './Notification'
import LoginForm from './LoginForm'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setUser } from '../reducers/userReducer'
import { showError, showNotification } from '../reducers/notificationReducer'
import { AppBar, Toolbar } from '@mui/material'

const LoginHeader = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const notificationMessage = useSelector(state => state.notification.messages[0])
  const errorMessage = useSelector(state => state.notification.errorMessages[0])

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
      dispatch(showNotification('Login succesful!'))
    } catch (exception) {
      if (exception.name === 'AxiosError' && exception.code === 'ERR_BAD_RESPONSE') {
        console.log(exception)
        const errorMessage = 'Unable to log in. Server probably down'
        console.log(errorMessage)
        dispatch(showError(errorMessage))
      } else {
        console.log(exception)
        console.log('wrong credentials')
        dispatch(showError('wrong username or password'))
      }
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar></Toolbar>
      </AppBar>
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
  )
}

export default LoginHeader
