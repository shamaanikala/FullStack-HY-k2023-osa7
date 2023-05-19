import { useComments } from '../hooks/useComments'

const CommentForm = ({ blog }) => {
  const commentHook = useComments()

  const createNewComment = async event => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    console.log(content)
    try {
      await commentHook.addComment(blog.id, content)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form onSubmit={createNewComment}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default CommentForm
