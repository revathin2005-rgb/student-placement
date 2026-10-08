import { useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'

const statusOrder = ['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

export default function ApplicationsPage() {
  const { applications } = useApp()
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return applications.filter((application) => {
      const matchesStatus = statusFilter === 'All' || application.status === statusFilter
      const matchesQuery = !query || application.company.toLowerCase().includes(query) || application.jobRole.toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [applications, searchTerm, statusFilter])

  return (
    <div className="page-content">
      <section className="page-header">
        <div>
          <p className="eyebrow accent">Application tracking</p>
          <h1>My applications</h1>
        </div>
      </section>

      <section className="panel filters-panel">
        <div className="search-stack">
          <div className="search-field">
            <Search size={17} />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search applications" />
          </div>
          <div className="select-wrap">
            <Filter size={15} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {statusOrder.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </section>

      {filteredApplications.length ? (
        <section className="panel table-panel">
          <div className="responsive-table">
            <table>
              <thead><tr><th>Company</th><th>Job Role</th><th>Applied Date</th><th>Status</th><th>Interview Date</th><th>Action</th></tr></thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td><strong>{application.company}</strong></td>
                    <td>{application.jobRole}</td>
                    <td>{new Date(`${application.appliedDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td><span className={`status-badge ${application.status.toLowerCase()}`}>{application.status}</span></td>
                    <td>{application.interviewDate || '—'}</td>
                    <td><button type="button" className="link-button">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="empty-state large"><Filter size={32} /><h3>No applications found</h3><p>Try another status or search term.</p></div>
      )}
    </div>
  )
}
