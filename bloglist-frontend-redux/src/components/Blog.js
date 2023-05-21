import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import commentService from '../services/comments'
import RemoveBlogButton from './MUI-components/RemoveBlogButton'
import { IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import LikeButton from './MUI-components/LikeButton'

const blogTitle = {
  textDecoration: 'underline',
  fontWeight: 'bold',
}

const BlogTitle = ({ blog, toggleBlog, blogOpen }) => {
  return (
    <>
      <span
        title="View and comment blog"
        onClick={toggleBlog}
        style={blogTitle}
        className="blogTitle"
      >
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </span>{' '}
      <span className="blogAuthor"> {blog.author}</span>
      {!blogOpen && (
        <IconButton aria-label="view" size="small" id="viewBlogButton" onClick={toggleBlog}>
          <ExpandMoreIcon />
        </IconButton>
      )}
      {blogOpen && (
        <IconButton aria-label="hide" size="small" variant="outlined" onClick={toggleBlog}>
          <ExpandLessIcon />
        </IconButton>
      )}
    </>
  )
}

const CommentStatus = ({ blog }) => {
  const [comments, setComments] = useState([])
  useEffect(() => {
    const load = async () => {
      const comms = await commentService.getByBlogId(blog.id)
      setComments(comms)
    }
    load()
  }, [blog.id])

  if (!comments) return null
  return (
    <div title="Click blog title to add comments">
      {comments.length === 0 && <em>no comments</em>}
      {comments.length === 1 && <em>1 comment</em>}
      {comments.length > 1 && <em>{comments.length} comments</em>}
    </div>
  )
}

const Blog = ({ user, blog, like, remove }) => {
  const [blogOpen, setBlogOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    width: 'fit-content',
    minWidth: '75%',
    marginTop: 5,
    borderRadius: 5,
  }

  const opened = {
    marginLeft: 5,
    marginBottom: 5,
  }

  const anonymousStyle = {
    color: 'grey',
    fontStyle: 'italic',
  }

  // klikattavan tekstin idea tämän perusteella:
  // https://stackoverflow.com/questions/43630991/by-clicking-text-how-to-change-clicked-text-to-another-text-in-react-js
  // eli luultavasti melkein mihin tahansa tagiin voi lisätä onClick()

  const toggleBlog = () => {
    setBlogOpen(!blogOpen)
  }

  return (
    <div className="blogBox" style={blogStyle}>
      {!blogOpen && (
        <div className="closed">
          <BlogTitle blog={blog} toggleBlog={toggleBlog} blogOpen={blogOpen} />
        </div>
      )}
      {blogOpen && (
        <div className="opened" style={opened}>
          <BlogTitle blog={blog} toggleBlog={toggleBlog} blogOpen={blogOpen} />
          <div className="blogUrl">
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </div>
          <div>
            likes <span id="likes">{blog.likes}</span>{' '}
            <LikeButton handleLike={() => like(blog.id)} />
          </div>
          {!blog.user && <span style={anonymousStyle}>Anonymous</span>}
          {blog.user && <span className="blogUser">{blog.user.name}</span>}
          <CommentStatus blog={blog} />
          {(!blog.user || user.username === blog.user.username) && (
            <div className="removeDiv">
              <RemoveBlogButton blog={blog} remove={remove} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
