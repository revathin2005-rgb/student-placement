import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  Filter,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function DashboardPage() {
  const { applications, jobsList, interviewList } = useApp()
  const { user } = useAuth()
  const [selectedRange, setSelectedRange] = useState('Monthly')

  const stats = useMemo(() => {
    const selected = applications.filter((application) => application.status === 'Selected').length
    const interviews = applications.filter((application) => application.status === 'Interview').length
    return {
      totalJobs: jobsList.length,
      applications: applications.length,
      interviews,
      selected,
    }
  }, [applications, jobsList.length])

  const applicationChartData = [
    { name: 'Applied', value: applications.filter((application) => application.status === 'Applied').length },
    { name: 'Shortlisted', value: applications.filter((application) => application.status === 'Shortlisted').length },
    { name: 'Interview', value: applications.filter((application) => application.status === 'Interview').length },
    { name: 'Selected', value: applications.filter((application) => application.status === 'Selected').length },
    { name: 'Rejected', value: applications.filter((application) => application.status === 'Rejected').length },
  ]

  const trendData = [
    { month: 'Jan', applications: 2 },
    { month: 'Feb', applications: 3 },
    { month: 'Mar', applications: 4 },
    { month: 'Apr', applications: 5 },
    { month: 'May', applications: 6 },
    { month: 'Jun', applications: 5 },
    { month: 'Jul', applications: 7 },
    { month: 'Aug', applications: 9 },
    { month: 'Sep', applications: 10 },
    { month: 'Oct', applications: applications.length },
  ]

  const companyData = jobsList.reduce((result, job) => {
    const key = job.company
    result[key] = (result[key] || 0) + 1
    return result
  }, {})

  const companyChartData = Object.entries(companyData).map(([company, applicationsCount]) => ({
    company,
    applications: applicationsCount,
  }))

  const deadlines = jobsList
    .slice()
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4)

  const upcomingInterviews = interviewList.filter((interview) => interview.status === 'Upcoming')
  const deadlineCounts = useMemo(
    () => deadlines.map((job) => ({
      ...job,
      // oxlint-disable-next-line react/purity
      daysLeft: Math.max(1, Math.ceil((new Date(`${job.deadline}T23:59:59`) - new Date()) / (1000 * 60 * 60 * 24))),
    })),
    [deadlines],
  )

  return (
    <div className="page-content">
      <section className="welcome-section">
        <div>
          <span className="eyebrow accent">Placement dashboard</span>
          <h1>Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}!</h1>
          <p>Keep pushing your career goals forward with relevant opportunities and interview preparation.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/jobs" className="primary-button"><BriefcaseBusiness size={18} />Find Jobs</Link>
          <Link to="/applications" className="secondary-button"><FileCheck2 size={18} />View Applications</Link>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Total Jobs" value={stats.totalJobs} detail="Open opportunities" icon={BriefcaseBusiness} tone="primary" />
        <StatCard title="Applications" value={stats.applications} detail="Across all roles" icon={FileCheck2} tone="indigo" />
        <StatCard title="Interviews" value={stats.interviews} detail="In progress" icon={CalendarClock} tone="success" />
        <StatCard title="Selected" value={stats.selected} detail="Offers received" icon={CheckCircle2} tone="warning" />
      </section>

      <section className="analytics-grid">
        <article className="panel chart-panel wide-panel">
          <div className="panel-header">
            <div><p className="eyebrow">Application overview</p><h2>Application status</h2></div>
            <div className="inline-segment">
              <button type="button" className={selectedRange === 'Monthly' ? 'active' : ''} onClick={() => setSelectedRange('Monthly')}>Monthly</button>
              <button type="button" className={selectedRange === 'Quarterly' ? 'active' : ''} onClick={() => setSelectedRange('Quarterly')}>Quarterly</button>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={applicationChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {applicationChartData.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-grid">{applicationChartData.map((item, index) => <span key={item.name}><i style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />{item.name}: {item.value}</span>)}</div>
        </article>

        <article className="panel chart-panel">
          <div className="panel-header">
            <div><p className="eyebrow">Career momentum</p><h2>Placement trend</h2></div>
            <TrendingUp size={18} className="panel-icon" />
          </div>
          <div className="chart-wrap small-chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trendData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applications" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel chart-panel wide-panel">
          <div className="panel-header">
            <div><p className="eyebrow">Opportunity distribution</p><h2>Company-wise applications</h2></div>
            <Filter size={18} className="panel-icon" />
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyChartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="company" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="applications" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="panel deadline-panel">
          <div className="panel-header">
            <div><p className="eyebrow">Upcoming actions</p><h2>Deadlines</h2></div>
            <Sparkles size={18} className="panel-icon" />
          </div>
          <div className="deadline-list">
            {deadlineCounts.map((job) => (
              <div key={job.id} className="deadline-item">
                <div className="company-logo tiny">{job.logo}</div>
                <div>
                  <strong>{job.company}</strong>
                  <p>{job.title}</p>
                </div>
                <span>{job.daysLeft}d</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="panel quick-actions-panel">
        <div className="panel-header">
          <div><p className="eyebrow">Quick actions</p><h2>Continue your progress</h2></div>
          <GraduationCap size={18} className="panel-icon" />
        </div>
        <div className="quick-actions">
          <Link to="/jobs">Find Jobs <ArrowRight size={16} /></Link>
          <Link to="/applications">View Applications <ArrowRight size={16} /></Link>
          <Link to="/interviews">Upcoming Interviews <ArrowRight size={16} /></Link>
          <Link to="/profile">Update Profile <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="panel next-interview-panel">
        <div className="panel-header">
          <div><p className="eyebrow">Interview readiness</p><h2>Upcoming interviews</h2></div>
        </div>
        {upcomingInterviews.length ? (
          <div className="interview-list compact">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="interview-row">
                <span className="company-mark">{interview.company.slice(0, 2).toUpperCase()}</span>
                <div><strong>{interview.company}</strong><p>{interview.role}</p></div>
                <span>{interview.date}</span>
                <span>{interview.time}</span>
                <span className="status-badge interview">{interview.mode}</span>
              </div>
            ))}
          </div>
        ) : <div className="empty-state"><p>No interviews scheduled yet.</p></div>}
      </section>
    </div>
  )
}
