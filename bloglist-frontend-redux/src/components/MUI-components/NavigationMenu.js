import { AppBar, Toolbar, Button, Typography, Menu, MenuItem, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { IconButton } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState } from 'react'

// mallia https://mui.com/material-ui/react-app-bar/
const NavigationMenu = ({ user, handleLogout }) => {
  const [menuPosition, setMenuPosition] = useState(null)
  const openMenu = event => setMenuPosition(event.currentTarget)
  const handleMenuClose = () => setMenuPosition(null)

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>
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
          <AccountCircle />
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
