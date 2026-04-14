import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function ServerInventoryPage({ token, role }) {
  const [servers, setServers] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setError('')
      setServers(await api.listServers(token))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id) {
    try {
      await api.deleteServer(token, id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <h2>Server Inventory</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Host</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr key={server.id}>
              <td>{server.name}</td>
              <td>{server.host}:{server.port}</td>
              <td>{server.status}</td>
              <td>
                {role === 'admin' && <Link to={`/servers/${server.id}/edit`}>Edit</Link>}
                {role === 'admin' && <button onClick={() => handleDelete(server.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
