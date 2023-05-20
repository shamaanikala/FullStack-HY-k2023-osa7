import PropTypes from 'prop-types'
import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  //return <div className={type}>{message}</div>
  return (
    <>
      {type === 'error' && <Alert severity="error">{message}</Alert>}
      {type === 'notification' && <Alert severity="info">{message}</Alert>}
      {type === 'info' && <Alert severity="info">{message}</Alert>}
      {type === 'logout' && <Alert severity="info">{message}</Alert>}
    </>
  )
}

Notification.propTypes = {
  //message: PropTypes.string.isRequired, // ei voi ossa isRequired, jos null
  type: PropTypes.string.isRequired,
}

export default Notification
