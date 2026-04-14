import { useState } from 'react'

const initialState = {
  name: '',
  host: '',
  port: 22,
  username: '',
  password: '',
}

export default function ServerForm({ initialValues = initialState, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(initialValues)
  const [error, setError] = useState('')

  function validate(values) {
    if (!values.name || !values.host || !values.username || !values.password) {
      return 'All fields are required.'
    }
    if (Number(values.port) < 1 || Number(values.port) > 65535) {
      return 'Port must be between 1 and 65535.'
    }
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationMessage = validate(form)
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setError('')
    await onSubmit({ ...form, port: Number(form.port) })
  }

  return (
    <form onSubmit={handleSubmit} className="card form-grid">
      <h3>Server Form</h3>
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Host" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
      <input type="number" placeholder="Port" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} />
      <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">{submitLabel}</button>
    </form>
  )
}
