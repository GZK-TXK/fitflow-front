import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import '../../styles/layout.scss'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="shell">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      {sidebarOpen && <div className="shell__overlay" onClick={closeSidebar} />}

      <div className="shell__main">
        <Navbar onMenuClick={openSidebar} />
        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
