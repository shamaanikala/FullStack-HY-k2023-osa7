// esimerkki suoraan täältä:
// https://mui.com/material-ui/react-snackbar/
import { useState, Fragment } from 'react'
import { Button, Snackbar, IconButton } from '@mui/material'

import { CloseIcon } from '@mui/icons-material'

export default function SimpleSnackbar() {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const action = (
    <Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  )

  return (
    <div>
      <Button onClick={handleClick}>Open simple snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      />
    </div>
  )
}

// mallia https://mui.com/material-ui/react-snackbar/
// export const LikeSnackbar = ({ message, duration = 5000 }) => {
//   const [open, setOpen] = useState(false)

//   const toggle = () => setOpen(!open)

//   return <Snackbar open={open} autoHideDuration={duration} onClose={toggle} message={message} />
// }
