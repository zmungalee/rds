import { Navigate, Route, Routes } from 'react-router-dom'
import { useMemo, useState } from 'react'
import LoginPage from './pages/LoginPage'
import ServerInventoryPage from './pages/ServerInventoryPage'
import ServerFormPage from './pages/ServerFormPage'
import HealthPage from './pages/HealthPage'
import Layout from './components/Layout'

export default function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('rds-auth')
    return stored ? JSON.parse(stored) : null
  })

  const role = auth?.role

  const authActions = useMemo(() => ({
    onLogin(data) {
      const payload = { token: data.access_token, role: data.role }
      localStorage.setItem('rds-auth', JSON.stringify(payload))
      setAuth(payload)
    },
    onLogout() {
      localStorage.removeItem('rds-auth')
      setAuth(null)
    },
  }), [])

  if (!auth) return <LoginPage onLogin={authActions.onLogin} />

  return (
    <Layout onLogout={authActions.onLogout} role={role}>
      <Routes>
        <Route path="/servers" element={<ServerInventoryPage token={auth.token} role={role} />} />
        <Route path="/servers/new" element={role === 'admin' ? <ServerFormPage token={auth.token} mode="create" /> : <Navigate to="/servers" />} />
        <Route path="/servers/:id/edit" element={role === 'admin' ? <ServerFormPage token={auth.token} mode="edit" /> : <Navigate to="/servers" />} />
        <Route path="/health" element={<HealthPage token={auth.token} />} />
        <Route path="*" element={<Navigate to="/servers" />} />
      </Routes>
    </Layout>
  )
}
