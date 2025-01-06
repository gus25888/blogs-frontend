import PropTypes from 'prop-types'

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => (
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="username">username</label>
      <input
        type="text"
        value={username}
        name="username"
        id="username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">password</label>
      <input
        type="password"
        value={password}
        name="password"
        id="password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">Login</button>
  </form>)

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm