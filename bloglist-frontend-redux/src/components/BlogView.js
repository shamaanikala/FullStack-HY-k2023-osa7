import { useBlogs } from '../hooks/useBlogs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useComments } from '../hooks/useComments'
import CommentForm from './CommentForm'
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { Comment } from '@mui/icons-material'
import RemoveBlogButton from './MUI-components/RemoveBlogButton'

const BlogView = ({ blog }) => {
  const user = useSelector(state => state.user)
  const blogsHook = useBlogs()
  const navigate = useNavigate()

  const comments = useComments(blog)

  // likessa on pakko antaa parametrit, sillä se tarvitsee user myös
  const like = async id => blogsHook.handleLike(id, user)
  // remove menisi myös suoraan näin: const remove = blogsHook.handleRemove
  // mutta, koska nyt halutaan navigate('/') mukaan, niin parametrit eksplisiittisesti
  const remove = async (id, title, author) => {
    try {
      await blogsHook.handleRemove(id, title, author)
    } catch (error) {
      if (error.message === 'Blog removal cancelled by user!') {
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
            <List sx={{ width: '50%', bgcolor: 'paper' }}>
              {comments.data.map(com => (
                <ListItem key={com.id} alignItems="flex-start" divider>
                  <ListItemIcon>
                    <Comment color="action" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{com.content}</ListItemText>
                </ListItem>
              ))}
            </List>
          )}
        </div>

        {(!blog.user || user.username === blog.user.username) && (
          <div className="removeDiv">
            <RemoveBlogButton blog={blog} remove={remove} />
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogView
