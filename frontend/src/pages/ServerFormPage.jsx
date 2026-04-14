import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import ServerForm from '../components/ServerForm'

export default function ServerFormPage({ token, mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.listServers(token)
        .then((servers) => servers.find((s) => Number(s.id) === Number(id)))
        .then((server) => setInitialValues(server))
        .catch((err) => setError(err.message))
    }
  }, [mode, id, token])

  async function handleSubmit(values) {
    try {
      setError('')
      if (mode === 'edit' && id) {
        await api.updateServer(token, id, values)
      } else {
        await api.createServer(token, values)
      }
      navigate('/servers')
    } catch (err) {
      setError(err.message)
    }
  }

  if (mode === 'edit' && !initialValues) return <p>Loading...</p>

  return (
    <>
      {error && <p className="error">{error}</p>}
      <ServerForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={mode === 'edit' ? 'Update Server' : 'Add Server'}
      />
    </>
  )
}
