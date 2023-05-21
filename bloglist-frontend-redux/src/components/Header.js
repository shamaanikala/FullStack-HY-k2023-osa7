import Notification from './Notification'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import { useAuth } from '../hooks/useAuth'
import NavigationMenu from './MUI-components/NavigationMenu'
import { Typography } from '@mui/material'

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

  return (
    <div>
      <div>
        <NavigationMenu user={user} handleLogout={handleLogout} />
      </div>
      <Typography variant="h2">blog app</Typography>
      <div>
        <Notification message={errorMessage} type={'error'} />
        <Notification message={notificationMessage} type={'blogAdded'} />
      </div>
    </div>
  )
}
// {{errorMessage && <Alert severity="error">{errorMessage}</Alert>}
// {notificationMessage && <Alert severity="success">{notificationMessage}</Alert>}
/* <div className="notificationBox">
        <Notification message={errorMessage} type={'error'} />
        <Notification message={notificationMessage} type={'blogAdded'} />
      </div> */
// }
export default Header
