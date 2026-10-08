import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function NotificationsPage() {
  const { notificationsList, markNotificationRead, markAllNotificationsRead, deleteNotification } = useApp()
  const unreadCount = notificationsList.filter((notification) => !notification.read).length

  return (
    <div className="page-content">
      <section className="page-header page-header-row">
        <div>
          <p className="eyebrow accent">Updates</p>
          <h1>Notifications</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-button" onClick={markAllNotificationsRead} disabled={!unreadCount}><CheckCheck size={16} /> Mark all as read</button>
        </div>
      </section>

      {notificationsList.length ? (
        <section className="notification-list">
          {notificationsList.map((notification) => (
            <article key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <div className="notification-icon"><Bell size={16} /></div>
              <div className="notification-copy">
                <div className="notification-head">
                  <span className="pill small">{notification.category}</span>
                  {!notification.read ? <span className="dot" /> : null}
                </div>
                <p>{notification.title}</p>
                <time>{new Date(notification.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
              </div>
              <div className="notification-actions">
                {!notification.read ? <button type="button" className="link-button" onClick={() => markNotificationRead(notification.id)}>Mark read</button> : null}
                <button type="button" className="icon-button danger" onClick={() => { if (window.confirm('Delete this notification?')) deleteNotification(notification.id) }} aria-label="Delete notification"><Trash2 size={15} /></button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state large"><Bell size={32} /><h3>No notifications</h3><p>You are all caught up.</p></div>
      )}
    </div>
  )
}
