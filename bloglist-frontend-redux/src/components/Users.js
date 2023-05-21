import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import {
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'

const UsersTable = ({ users }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <b>blogs created</b>
            </TableCell>
          </TableRow>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Users = () => {
  const users = useUsers()

  return (
    <div>
      <Card>
        <Typography variant="h4">Users 😸</Typography>
        <CardContent>
          {users.query.isLoading && <div>loading...</div>}
          {users.query.isSuccess && (
            <>
              <UsersTable users={users.data} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
