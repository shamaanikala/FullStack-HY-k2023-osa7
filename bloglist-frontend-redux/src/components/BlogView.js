import { useBlogs } from '../hooks/useBlogs'
import { useSelector } from 'react-redux'

const BlogView = ({ blog }) => {
  const user = useSelector(state => state.user)
  const blogsHook = useBlogs()
  // likessa on pakko antaa parametrit, sillä se tarvitsee
  // user myös
  const like = async id => blogsHook.handleLike(id, user)
  // remove menee suoraan näin
  const remove = blogsHook.handleRemove

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
