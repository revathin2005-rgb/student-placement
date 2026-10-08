import { CalendarDays, MapPin, BriefcaseBusiness, IndianRupee } from 'lucide-react'

export default function JobCard({ job, onApply, applied }) {
  const deadlineMessage = getDeadlineStatus(job.deadline)

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="company-logo" aria-label={`${job.company} logo`}>{job.logo}</div>
        <div>
          <p className="eyebrow">{job.company}</p>
          <h3>{job.title}</h3>
        </div>
        {applied ? <span className="status-badge applied">Applied</span> : null}
      </div>

      <div className="job-meta">
        <span><MapPin size={14} /> {job.location}</span>
        <span><BriefcaseBusiness size={14} /> {job.type}</span>
        <span><IndianRupee size={14} /> {job.salary}</span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="tag-list">
        {job.skills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
      </div>

      <div className="job-footer">
        <div className="job-detail">
          <span className="muted">Experience</span>
          <strong>{job.experience}</strong>
        </div>
        <div className="job-detail deadline">
          <CalendarDays size={15} />
          <span>{deadlineMessage}</span>
        </div>
      </div>

      <button type="button" className="primary-button" onClick={() => onApply(job)} disabled={applied}>
        {applied ? 'Applied' : 'Apply Now'}
      </button>
    </article>
  )
}

function getDeadlineStatus(dateString) {
  const date = new Date(`${dateString}T23:59:59`)
  const daysRemaining = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))

  if (daysRemaining <= 0) return 'Deadline passed'
  if (daysRemaining === 1) return '1 day left'
  return `${daysRemaining} days left`
}
