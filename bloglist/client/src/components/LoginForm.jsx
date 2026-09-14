import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ loginService }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = e => {
    e.preventDefault()
    loginService({ username, password })
    navigate('/')
    setUsername('')
    setPassword('')
  }

  const style = {
    margin: '0.5rem 0rem 1rem 0rem'
  }

  return(
    <div>
      <h2>Log in to appplication</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <TextField
              variant="standard"
              value={username}
              onChange ={({ target }) => setUsername(target.value)}
              placeholder="username"
              sx={style}
            />
          </label>
        </div>
        <div>
          <TextField
            variant="standard"
            value={password}
            type="password"
            onChange ={({ target }) => setPassword(target.value)}
            placeholder="password"
            sx={style}
          />
        </div>
        <Button type="submit" variant="contained">Log in</Button>
      </form>
    </div>
  )
}

export default LoginForm