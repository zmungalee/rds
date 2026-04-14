import { useState } from 'react'
import { api } from '../api'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const data = await api.login({ username, password })
      onLogin(data)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="centered">
      <form onSubmit={handleSubmit} className="card form-grid">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}
