import { Snackbar, Alert } from '@mui/material'
import { useComments } from '../hooks/useComments'
import { useState } from 'react'

const CommentForm = ({ blog }) => {
  const commentHook = useComments()

  const createNewComment = async event => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    console.log(content)
    try {
      // https://tanstack.com/query/v4/docs/react/guides/mutations#promises
      const comment = await commentHook.commentMutation.mutateAsync({ blog: blog.id, content })
      console.log(comment)
    } catch (err) {
      console.log(err)
      console.log(err.message)
      console.log(err.response.data.message)
      setErrorMessage(err.response.data.message)
      setCommentSuccesful(false)
    } finally {
      setOpen(true)
    }
  }

  // https://mui.com/material-ui/react-snackbar/
  const [open, setOpen] = useState(false)
  const [commentSuccesful, setCommentSuccesful] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    !commentSuccesful ? setCommentSuccesful(true) : setCommentSuccesful(false)
    setErrorMessage(null)
  }

  return (
    <div>
      <div>
        <Snackbar open={open && commentSuccesful} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Comment added!
          </Alert>
        </Snackbar>
        <Snackbar open={open && !commentSuccesful} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            Failed to add comment! ({errorMessage})
          </Alert>
        </Snackbar>
      </div>
      <form onSubmit={createNewComment}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default CommentForm
