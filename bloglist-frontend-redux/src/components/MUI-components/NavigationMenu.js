import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
  Box,
  ButtonGroup,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { IconButton } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState, useEffect } from 'react'

// mallia https://mui.com/material-ui/react-app-bar/
const NavigationMenu = ({ user, handleLogout }) => {
  const [menuPosition, setMenuPosition] = useState(null)
  const openMenu = event => setMenuPosition(event.currentTarget)
  const handleMenuClose = () => setMenuPosition(null)

  const [buttonGroupOrientation, setButtonGroupOrientation] = useState('horizontal')

  useEffect(() => {
    window.onresize = () => {
      window.innerWidth <= 450
        ? setButtonGroupOrientation('vertical')
        : setButtonGroupOrientation('horizontal')
    }
  }, [setButtonGroupOrientation])

  return (
    <AppBar position="static">
      <Toolbar>
        <ButtonGroup orientation={buttonGroupOrientation} sx={{ mb: '1em', mt: '1em' }}>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
        </ButtonGroup>
        <Box sx={{ flexGrow: 1 }} />
        <Typography align="right" fontSize="small">
          {user.name}
          <br /> logged in
        </Typography>
        <IconButton
          aria-label="user account"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          onClick={openMenu}
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={menuPosition}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(menuPosition)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
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
