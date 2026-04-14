const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function withAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...withAuthHeaders(token),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(data.detail || 'Request failed')
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  listServers: (token) => request('/api/servers', {}, token),
  createServer: (token, body) => request('/api/servers', { method: 'POST', body: JSON.stringify(body) }, token),
  updateServer: (token, id, body) => request(`/api/servers/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token),
  deleteServer: (token, id) => request(`/api/servers/${id}`, { method: 'DELETE' }, token),
  checkHealth: (token, id) => request(`/api/servers/${id}/health`, {}, token),
}
