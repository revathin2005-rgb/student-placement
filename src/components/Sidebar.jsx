import {
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  FileText,
  LayoutDashboard,
  LogOut,
  Bell,
  CalendarDays,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Placement Opportunities', icon: BriefcaseBusiness },
  { to: '/applications', label: 'My Applications', icon: FileText },
  { to: '/interviews', label: 'Interviews', icon: CalendarDays },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: CircleUserRound },
]

export default function Sidebar({ open, onClose, onLogout, unreadCount }) {
  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">SP</div>
          <div>
            <strong>Student Placement</strong>
            <span>Career Center</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
              {to === '/notifications' && unreadCount > 0 ? (
                <span className="nav-badge">{unreadCount}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar-logout" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <button
        type="button"
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={onClose}
        aria-label="Close navigation"
      />
    </>
  )
}
