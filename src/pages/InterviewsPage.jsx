import { CalendarDays, Clock3, Laptop2, MapPin, UserRound } from 'lucide-react'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export default function InterviewsPage() {
  const { interviewList } = useApp()
  const upcoming = useMemo(
    () => interviewList.filter((interview) => interview.status === 'Upcoming').map((interview) => ({
      ...interview,
      // oxlint-disable-next-line react/purity
      dateValue: new Date(`${interview.date}T00:00:00`),
      // oxlint-disable-next-line react/purity
      daysRemaining: Math.ceil((new Date(`${interview.date}T00:00:00`) - new Date()) / (1000 * 60 * 60 * 24)),
    })),
    [interviewList],
  )

  return (
    <div className="page-content">
      <section className="page-header">
        <div>
          <p className="eyebrow accent">Interview schedule</p>
          <h1>Upcoming interviews</h1>
        </div>
      </section>

      <section className="interview-grid">
        {upcoming.map((interview) => {
          const isSoon = interview.daysRemaining <= 2

          return (
            <article key={interview.id} className={`panel interview-card ${isSoon ? 'soon' : ''}`}>
              <div className="interview-card-header">
                <div className="company-logo large">{interview.company.slice(0, 2).toUpperCase()}</div>
                <div>
                  <p className="eyebrow">{interview.company}</p>
                  <h3>{interview.role}</h3>
                </div>
                {isSoon ? <span className="status-badge interview">Soon</span> : null}
              </div>

              <div className="interview-meta">
                <span><CalendarDays size={15} /> {interview.dateValue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span><Clock3 size={15} /> {interview.time}</span>
              </div>
              <div className="interview-meta">
                <span><Laptop2 size={15} /> {interview.mode}</span>
                <span><UserRound size={15} /> {interview.interviewer}</span>
              </div>
              <div className="interview-footer">
                <span className="status-badge upcoming">{interview.status}</span>
                {isSoon ? <span className="countdown">{interview.daysRemaining === 0 ? 'Today' : `${interview.daysRemaining} days left`}</span> : <span className="countdown muted">Scheduled</span>}
              </div>
            </article>
          )
        })}
      </section>

      <section className="panel">
        <div className="panel-header"><div><p className="eyebrow">Schedule history</p><h2>All interviews</h2></div></div>
        <div className="interview-history">
          {interviewList.map((interview) => (
            <div key={interview.id} className="history-row">
              <div className="company-mark">{interview.company.slice(0, 2).toUpperCase()}</div>
              <div><strong>{interview.company}</strong><p>{interview.role}</p></div>
              <span><CalendarDays size={14} /> {interview.date}</span>
              <span><Clock3 size={14} /> {interview.time}</span>
              <span><MapPin size={14} /> {interview.mode}</span>
              <span className={`status-badge ${interview.status.toLowerCase()}`}>{interview.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
