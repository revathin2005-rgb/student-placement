import { useState } from 'react'
import { Camera, Save, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || '',
    department: user?.department || '',
    year: user?.year || '',
    cgpa: user?.cgpa || '',
    skills: user?.skills?.join(', ') || '',
    resume: user?.resume || '',
    linkedIn: user?.linkedIn || '',
    github: user?.github || '',
  })
  const [status, setStatus] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = form.fullName.trim()
    const trimmedEmail = form.email.trim()

    if (!trimmedName || !trimmedEmail || !form.phone.trim() || !form.college.trim() || !form.department.trim()) {
      setStatus({ type: 'error', message: 'Please complete all required profile fields.' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' })
      return
    }

    updateProfile({
      ...form,
      fullName: trimmedName,
      email: trimmedEmail,
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      cgpa: Number(form.cgpa) || 0,
    })
    setStatus({ type: 'success', message: 'Profile updated successfully.' })
  }

  return (
    <div className="page-content">
      <section className="page-header">
        <div>
          <p className="eyebrow accent">Student profile</p>
          <h1>Profile management</h1>
        </div>
      </section>

      <section className="panel profile-panel">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{user?.avatar || user?.fullName?.slice(0, 2).toUpperCase() || 'ST'}</div>
            <button type="button" className="avatar-button"><Camera size={15} /> Edit photo</button>
          </div>
          <div>
            <h2>{user?.fullName || 'Student Profile'}</h2>
            <p>{user?.college || 'College information pending'}</p>
            <div className="status-row"><span className="status-badge selected">Profile ready</span></div>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <label>Full Name<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /> </label>
            <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /> </label>
          </div>
          <div className="field-row">
            <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /> </label>
            <label>College<input value={form.college} onChange={(event) => setForm({ ...form, college: event.target.value })} /> </label>
          </div>
          <div className="field-row">
            <label>Department<input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} /> </label>
            <label>Year<select value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })}><option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option></select></label>
          </div>
          <div className="field-row">
            <label>CGPA<input type="number" step="0.1" value={form.cgpa} onChange={(event) => setForm({ ...form, cgpa: event.target.value })} /> </label>
            <label>Skills<input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} /> </label>
          </div>
          <div className="field-row">
            <label>Resume<input value={form.resume} onChange={(event) => setForm({ ...form, resume: event.target.value })} /> </label>
            <label>LinkedIn<input value={form.linkedIn} onChange={(event) => setForm({ ...form, linkedIn: event.target.value })} /> </label>
          </div>
          <label>GitHub<input value={form.github} onChange={(event) => setForm({ ...form, github: event.target.value })} /> </label>
          {status ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}
          <div className="form-actions profile-actions">
            <button type="button" className="secondary-button"><Upload size={16} /> Upload Resume</button>
            <button type="submit" className="primary-button"><Save size={16} /> Save Profile</button>
          </div>
        </form>
      </section>
    </div>
  )
}
