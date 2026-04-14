import { useEffect, useState } from 'react'
import { api } from '../api'

const errorMap = {
  unreachable: 'Host is unreachable. Verify DNS/network and firewall rules.',
  credential_failure: 'Credential validation failed. Check username/password.',
}

export default function HealthPage({ token }) {
  const [servers, setServers] = useState([])
  const [statusMap, setStatusMap] = useState({})

  useEffect(() => {
    api.listServers(token).then(setServers).catch(() => setServers([]))
  }, [token])

  async function runHealthCheck(id) {
    try {
      const data = await api.checkHealth(token, id)
      setStatusMap((prev) => ({ ...prev, [id]: data }))
    } catch (err) {
      setStatusMap((prev) => ({ ...prev, [id]: { status: 'error', message: err.message } }))
    }
  }

  return (
    <section className="card">
      <h2>Live Status / Health</h2>
      {servers.map((server) => {
        const info = statusMap[server.id]
        return (
          <article key={server.id} className="health-row">
            <div>
              <strong>{server.name}</strong> ({server.host}:{server.port})
              {info && <p className={info.reachable ? 'ok' : 'error'}>{errorMap[info.status] || info.message}</p>}
            </div>
            <button onClick={() => runHealthCheck(server.id)}>Check now</button>
          </article>
        )
      })}
    </section>
  )
}
