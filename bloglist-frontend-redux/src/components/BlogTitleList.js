import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import BookIcon from '@mui/icons-material/Book'

const BlogTitleList = ({ blogs }) => {
  return (
    <List>
      {blogs.map(blog => (
        <ListItem key={blog.title} divider>
          <ListItemIcon>
            <BookIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export default BlogTitleList
