import { Link } from 'react-router-dom'

export default function Layout({ onLogout, role, children }) {
  return (
    <div className="shell">
      <aside>
        <h2>RDS Admin</h2>
        <nav>
          <Link to="/servers">Inventory</Link>
          <Link to="/servers/new">Add Server</Link>
          <Link to="/health">Live Health</Link>
        </nav>
        <p className="role">Role: {role}</p>
        <button type="button" onClick={onLogout}>Logout</button>
      </aside>
      <main>{children}</main>
    </div>
  )
}
