import { Bell, Menu, Search, SunMedium, Moon, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function Topbar({ onMenuToggle, unreadCount }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useApp()

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (confirmed) logout()
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="icon-button mobile-only" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="global-search">
          <Search size={16} />
          <input type="search" placeholder="Search companies, roles, skills..." aria-label="Global search" />
        </div>
      </div>

      <div className="topbar-actions">
        <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <SunMedium size={18} />}
        </button>

        <Link to="/notifications" className="notification-button" aria-label="Notifications">
          <Bell size={19} />
          {unreadCount > 0 ? <span className="notification-count">{unreadCount}</span> : null}
        </Link>

        <div className="user-menu">
          <div className="user-avatar tiny">{user?.avatar || user?.fullName?.slice(0, 2).toUpperCase() || 'ST'}</div>
          <div className="user-menu-text">
            <strong>{user?.fullName || 'Student'}</strong>
            <span>{user?.department || 'Student'}</span>
          </div>
          <button type="button" className="icon-button user-action" onClick={handleLogout} aria-label="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  )
}
