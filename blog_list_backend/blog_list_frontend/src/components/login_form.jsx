import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ createUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const addUser = (event) => {
    event.preventDefault()
    createUser({ username: username, password: password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={addUser}>
        <div>
            username
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
            password
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" id="login-button">Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  createUser: PropTypes.func.isRequired,
}

export default LoginForm