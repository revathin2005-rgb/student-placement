import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import JobCard from '../components/JobCard'
import { useApp } from '../context/AppContext'

const initialFilters = {
  location: 'All',
  salary: 'All',
  type: 'All',
  skill: 'All',
}

export default function JobsPage() {
  const { jobsList, applications, addApplication } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('newest')
  const [applicationJob, setApplicationJob] = useState(null)
  const [notice, setNotice] = useState(null)

  const appliedJobIds = new Set(applications.map((application) => application.jobId))

  const locations = ['All', ...new Set(jobsList.map((job) => job.location))]
  const salaryRanges = ['All', '₹8-12 LPA', '₹10-15 LPA', '₹12-18 LPA', '₹18+ LPA']
  const jobTypes = ['All', 'Full Time', 'Hybrid', 'Remote']
  const skills = ['All', ...new Set(jobsList.flatMap((job) => job.skills))]

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    let result = jobsList.filter((job) => {
      const matchesText = !query || job.company.toLowerCase().includes(query) || job.title.toLowerCase().includes(query)
      const matchesLocation = filters.location === 'All' || job.location === filters.location
      const matchesSalary = filters.salary === 'All' || job.salary.includes(filters.salary.replace('₹', '').replace(' LPA', '').split('-')[0]) || filters.salary === '₹18+ LPA'
      const matchesType = filters.type === 'All' || job.type === filters.type
      const matchesSkill = filters.skill === 'All' || job.skills.includes(filters.skill)
      return matchesText && matchesLocation && matchesSalary && matchesType && matchesSkill
    })

    result = result.sort((a, b) => {
      if (sortBy === 'salary') return b.salary.localeCompare(a.salary)
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline)
      return b.id.localeCompare(a.id)
    })

    return result
  }, [filters, jobsList, searchTerm, sortBy])

  function resetFilters() {
    setFilters(initialFilters)
    setSearchTerm('')
  }

  function handleApply(job) {
    setApplicationJob(job)
  }

  function handleSubmitApplication(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const applicationData = {
      jobId: applicationJob.id,
      company: applicationJob.company,
      jobTitle: applicationJob.title,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      resume: formData.get('resume'),
      coverLetter: formData.get('coverLetter'),
      skills: formData.get('skills'),
    }

    const errors = {}
    if (!applicationData.fullName?.trim()) errors.fullName = 'Full name is required'
    if (!applicationData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.email)) errors.email = 'Please enter a valid email'
    if (!applicationData.phone?.trim()) errors.phone = 'Phone number is required'
    if (!applicationData.resume?.trim()) errors.resume = 'Resume is required'
    if (!applicationData.skills?.trim()) errors.skills = 'Skills are required'

    const errorList = document.querySelectorAll('.field-error')
    errorList.forEach((element) => { element.textContent = '' })

    const formErrors = Object.entries(errors)
    if (formErrors.length) {
      formErrors.forEach(([key, message]) => {
        const field = form.querySelector(`[data-error="${key}"]`)
        if (field) field.textContent = message
      })
      return
    }

    const result = addApplication(applicationData)
    if (!result.success) {
      setNotice({ type: 'error', message: result.message })
      return
    }

    setNotice({ type: 'success', message: 'Application submitted successfully.' })
    form.reset()
    setApplicationJob(null)
  }

  return (
    <div className="page-content">
      <section className="page-header">
        <div>
          <p className="eyebrow accent">Explore opportunities</p>
          <h1>Placement opportunities</h1>
        </div>
      </section>

      <section className="panel filters-panel">
        <div className="search-stack">
          <div className="search-field">
            <Search size={17} />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by company or job title" />
          </div>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Sort: Newest</option>
            <option value="salary">Sort: Salary</option>
            <option value="deadline">Sort: Deadline</option>
          </select>
        </div>

        <div className="filter-grid">
          <select value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })}>{locations.map((location) => <option key={location}>{location}</option>)}</select>
          <select value={filters.salary} onChange={(event) => setFilters({ ...filters, salary: event.target.value })}>{salaryRanges.map((range) => <option key={range}>{range}</option>)}</select>
          <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>{jobTypes.map((type) => <option key={type}>{type}</option>)}</select>
          <select value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })}>{skills.map((skill) => <option key={skill}>{skill}</option>)}</select>
          <button type="button" className="secondary-button filter-reset" onClick={resetFilters}><X size={15} /> Clear</button>
        </div>
      </section>

      {notice ? <div className={`form-status ${notice.type}`}>{notice.message}</div> : null}

      {filteredJobs.length ? (
        <section className="jobs-grid">
          {filteredJobs.map((job) => <JobCard key={job.id} job={job} onApply={handleApply} applied={appliedJobIds.has(job.id)} />)}
        </section>
      ) : (
        <div className="empty-state large"><SlidersHorizontal size={32} /><h3>No jobs match your filters</h3><p>Try changing the location, job type, or skill selection.</p></div>
      )}

      {applicationJob ? (
        <div className="modal-backdrop" onClick={() => setApplicationJob(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow accent">Application form</p>
                <h2>{applicationJob.title}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setApplicationJob(null)} aria-label="Close application form">×</button>
            </div>

            <form className="application-form" onSubmit={handleSubmitApplication} noValidate>
              <div className="field-row">
                <label>Full Name<input name="fullName" data-error="fullName" placeholder="Enter your full name" /> <small className="field-error" /></label>
                <label>Email<input type="email" name="email" data-error="email" placeholder="you@example.com" /> <small className="field-error" /></label>
              </div>
              <div className="field-row">
                <label>Phone<input name="phone" data-error="phone" placeholder="+91 98765 43210" /> <small className="field-error" /></label>
                <label>Resume URL<input name="resume" data-error="resume" placeholder="https://example.com/resume.pdf" /> <small className="field-error" /></label>
              </div>
              <label>Cover Letter<textarea name="coverLetter" rows="4" placeholder="Tell us why you are a strong fit for this role" /></label>
              <label>Skills<input name="skills" data-error="skills" placeholder="React, JavaScript, SQL" /> <small className="field-error" /></label>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setApplicationJob(null)}>Cancel</button>
                <button type="submit" className="primary-button">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
