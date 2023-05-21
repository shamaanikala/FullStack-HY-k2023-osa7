import BlogTitleList from './BlogTitleList'
import { Card, CardContent, Typography } from '@mui/material'

const User = ({ user }) => {
  if (!user) {
    return <div>loading user information...</div>
  }

  return (
    <div>
      <Card>
        <Typography variant="h4">{user.name}</Typography>
        <CardContent>
          <Typography variant="h6">added blogs</Typography>
          <div>
            {user.blogs.length === 0 && <em>No blogs added</em>}
            {user.blogs.length > 0 && <BlogTitleList blogs={user.blogs} />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default User
