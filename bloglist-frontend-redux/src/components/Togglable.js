// Osan 5 materiaalista
import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardActions } from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // useImperativeHandle(ref, () => {
  //     // HUOM! return { } eikä () !
  //     return {
  //         toggleVisibility
  //     }

  // })
  // // tämä toimii myös
  // lähde: https://legacy.reactjs.org/docs/hooks-reference.html#useimperativehandle
  // miksi toimii tällä syntaksilla?
  // vastaus: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body
  // linkin viimeinen esimerkki
  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }))

  // entä toimiiko tämä sitten
  // ei toimi!
  //useImperativeHandle(ref, () => toggleVisibility)

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" size="small" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        <Card sx={{ width: 'fit-content' }}>
          <CardContent>{props.children}</CardContent>
          <CardActions>
            <Button variant="contained" size="small" onClick={toggleVisibility}>
              cancel
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
