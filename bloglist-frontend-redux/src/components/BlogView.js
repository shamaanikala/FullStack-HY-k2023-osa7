import { useBlogs } from '../hooks/useBlogs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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

const BlogView = ({ blog }) => {
  const user = useSelector(state => state.user)
  const blogsHook = useBlogs()
  const navigate = useNavigate()

  const comments = useComments(blog)

  // likessa on pakko antaa parametrit, sillä se tarvitsee
  // user myös
  const like = async id => blogsHook.handleLike(id, user)
  // remove menee suoraan näin
  // const remove = blogsHook.handleRemove
  // mutta navigate mukaan
  const remove = async (id, title, author) => {
    try {
      await blogsHook.handleRemove(id, title, author)
    } catch (error) {
      if (error.message === 'Blog removal cancelled by user!') {
        //console.log(error.message)
        return // ei mennä navigateen
      } else {
        console.log(error)
        return
      }
    }
    navigate('/')
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <em>by {blog.author}</em>
      </div>
      <br />
      <div>
        <div>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          likes <span id="likes">{blog.likes}</span>{' '}
          <button className="likeBUtton" onClick={() => like(blog.id)}>
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
      </div>
      <div>
        <div>
          <h3>comments</h3>
          <CommentForm blog={blog} />
          {comments.query.isLoading && <div>loading...</div>}
          {comments.query.isSuccess && comments.data.length === 0 && <em>no comments</em>}
          {comments.query.isSuccess && comments.data.length > 0 && (
            <ul>
              {comments.data.map(com => (
                <li key={com.id}>{com.content}</li>
              ))}
            </ul>
          )}
        </div>

        {(!blog.user || user.username === blog.user.username) && (
          <div className="removeDiv">
            <button
              className="removeButton"
              onClick={() => remove(blog.id, blog.title, blog.author)}
            >
              remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogView
