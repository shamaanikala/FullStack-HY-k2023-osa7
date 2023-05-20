// import Notification from './Notification'
import { useDispatch, useSelector } from 'react-redux'
import Logout from './Logout'
import { showNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { Alert } from '@mui/material'

const Header = () => {
  const dispatch = useDispatch()
  const auth = useAuth()
  const notificationMessage = useSelector(state => state.notification.messages[0])
  const errorMessage = useSelector(state => state.notification.errorMessages[0])
  const user = useSelector(state => state.user)

  const handleLogout = event => {
    event.preventDefault()
    auth.logout(setUser)
    dispatch(showNotification('user logged out', 1500))
  }

  const padding = { padding: 5 }
  return (
    <div>
      <div id="menu">
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {user.name} logged in <Logout handleLogout={handleLogout} />
      </div>
      <h2>blog app</h2>
      <div>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {notificationMessage && <Alert severity="success">{notificationMessage}</Alert>}
      </div>
    </div>
  )
}
{
  /* <div className="notificationBox">
        <Notification message={errorMessage} type={'error'} />
        <Notification message={notificationMessage} type={'blogAdded'} />
      </div> */
}
export default Header
