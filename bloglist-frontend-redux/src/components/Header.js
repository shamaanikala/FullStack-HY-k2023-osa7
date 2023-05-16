import Notification from './Notification'
import { useDispatch, useSelector } from 'react-redux'
import Logout from './Logout'
import { showNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import { logout } from '../authUtils'

const Header = () => {
  const dispatch = useDispatch()
  const notificationMessage = useSelector(state => state.notification.messages[0])
  const errorMessage = useSelector(state => state.notification.errorMessages[0])
  const user = useSelector(state => state.user)

  const handleLogout = event => {
    event.preventDefault()
    logout(setUser, dispatch)
    dispatch(showNotification('user logged out', 1500))
  }

  return (
    <div>
      <h2>blogs</h2>
      <div className="notificationBox">
        <Notification message={errorMessage} type={'error'} />
        <Notification message={notificationMessage} type={'blogAdded'} />
      </div>
      <p>
        {user.name} logged in <Logout handleLogout={handleLogout} />
      </p>
    </div>
  )
}

export default Header
