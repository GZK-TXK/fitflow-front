import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import '../../styles/layout.scss'

export default function AppLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell__main">
        <Navbar />
        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}