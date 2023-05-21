import { TextField, Card, CardContent, CardActions, Button } from '@mui/material'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <>
      <Card sx={{ width: 'fit-content' }}>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div>
              <TextField
                label="Username"
                value={username}
                name="Username"
                id="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <TextField
                label="Password"
                type="password"
                value={password}
                name="Password"
                id="password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <CardActions>
              <Button type="submit">login</Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default LoginForm
