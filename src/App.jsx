import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function AppShell() {
  const { user, logout } = useAuth()
  const { notificationsList } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const unreadCount = notificationsList.filter((notification) => !notification.read).length

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (!confirmed) return
    logout()
  }

  if (!user) {
    return <AppRoutes />
  }

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} unreadCount={unreadCount} />
      <div className="main-panel">
        <Topbar onMenuToggle={() => setSidebarOpen((value) => !value)} unreadCount={unreadCount} />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
