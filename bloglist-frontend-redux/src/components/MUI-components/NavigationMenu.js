import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import Logout from '../Logout'

const NavigationMenu = ({ user, handleLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Typography>{user.name} logged in</Typography>
        <Logout handleLogout={handleLogout} />
      </Toolbar>
    </AppBar>
  )
}

export default NavigationMenu

{
  /* <div id="menu">
  <Link style={padding} to="/">
    blogs
  </Link>
  <Link style={padding} to="/users">
    users
  </Link>
  {user.name} logged in <Logout handleLogout={handleLogout} />
</div> */
}
