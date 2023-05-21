import { Snackbar, Alert, Button } from '@mui/material'
import { useComments } from '../hooks/useComments'
import { useState } from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import FormHelperText from '@mui/material/FormHelperText'

const CommentForm = ({ blog }) => {
  const commentHook = useComments()

  const createNewComment = async event => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    setError(false)
    try {
      // https://tanstack.com/query/v4/docs/react/guides/mutations#promises
      // eslint-disable-next-line no-unused-vars
      const comment = await commentHook.commentMutation.mutateAsync({ blog: blog.id, content })
    } catch (err) {
      setErrorMessage(err.message)
      setCommentSuccesful(false)
      setError(true) // TextField & form
    } finally {
      setOpen(true)
    }
  }

  // https://mui.com/material-ui/react-snackbar/
  const [open, setOpen] = useState(false)
  const [commentSuccesful, setCommentSuccesful] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [error, setError] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    setCommentSuccesful(true)
    setErrorMessage(null)
  }

  return (
    <div>
      <div>
        <Snackbar open={open && commentSuccesful} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Comment added!
          </Alert>
        </Snackbar>
        <Snackbar open={open && !commentSuccesful} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            Failed to add comment! ({errorMessage})
          </Alert>
        </Snackbar>
      </div>
      <form onSubmit={createNewComment}>
        <div>
          {!error && (
            <Input
              multiline
              name="comment"
              label="Comment (multiline)"
              placeholder="Type in your comment"
              size="small"
            />
          )}
          {error && (
            <FormControl error={error}>
              <InputLabel error={error} htmlFor="validation-error">
                Content missing!
              </InputLabel>
              <Input
                id="validation-error"
                error={error}
                multiline
                name="comment"
                label="Comment (multiline)"
                placeholder="Type in your comment"
                size="small"
              />
              <FormHelperText id="validation-error-text">
                Comment content is required!
              </FormHelperText>
            </FormControl>
          )}
          <Button
            variant="standard"
            size="small"
            color="primary"
            type="submit"
            endIcon={<AddCommentIcon />}
          >
            add comment
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm
