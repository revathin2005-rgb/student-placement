import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  college: '',
  department: '',
  year: 'First Year',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState(null)

  function validate() {
    const nextErrors = {}

    if (!values.fullName.trim()) nextErrors.fullName = 'Full name is required'
    if (!values.email.trim()) nextErrors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Please enter a valid email'
    if (!values.phone.trim()) nextErrors.phone = 'Phone number is required'
    if (!values.college.trim()) nextErrors.college = 'College name is required'
    if (!values.department.trim()) nextErrors.department = 'Department is required'
    if (!values.password) nextErrors.password = 'Password is required'
    else if (values.password.length < 6) nextErrors.password = 'Password must contain at least 6 characters'
    if (!values.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password'
    else if (values.confirmPassword !== values.password) nextErrors.confirmPassword = 'Passwords do not match'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStatus(null)
    if (!validate()) return

    const result = register({ ...values, cgpa: 0, skills: [], resume: '', linkedIn: '', github: '' })
    if (!result.success) {
      setStatus({ type: 'error', message: result.message })
      return
    }

    setStatus({ type: 'success', message: 'Registration successful. Redirecting to your dashboard...' })
    window.setTimeout(() => navigate('/dashboard'), 800)
  }

  return (
    <div className="auth-shell">
      <div className="auth-illustration compact">
        <div className="auth-brand"><GraduationCap size={32} /> Student Placement</div>
        <h1>Create your student profile.</h1>
        <p>Build your career profile and unlock opportunities from top recruiters.</p>
      </div>

      <section className="auth-card register-card">
        <div className="auth-header">
          <span className="pill blue">New account</span>
          <h2>Register as a student</h2>
          <p>Complete your details to start exploring jobs.</p>
        </div>

        <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <label>Full Name<input value={values.fullName} onChange={(event) => setValues({ ...values, fullName: event.target.value })} placeholder="Enter full name" />{errors.fullName ? <small>{errors.fullName}</small> : null}</label>
            <label>Email<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" />{errors.email ? <small>{errors.email}</small> : null}</label>
          </div>

          <div className="field-row">
            <label>Phone<input value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} placeholder="+91 98765 43210" />{errors.phone ? <small>{errors.phone}</small> : null}</label>
            <label>College<input value={values.college} onChange={(event) => setValues({ ...values, college: event.target.value })} placeholder="College name" />{errors.college ? <small>{errors.college}</small> : null}</label>
          </div>

          <div className="field-row">
            <label>Department<input value={values.department} onChange={(event) => setValues({ ...values, department: event.target.value })} placeholder="Computer Science" />{errors.department ? <small>{errors.department}</small> : null}</label>
            <label>Year<select value={values.year} onChange={(event) => setValues({ ...values, year: event.target.value })}><option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option></select>{errors.year ? <small>{errors.year}</small> : null}</label>
          </div>

          <div className="field-row">
            <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="At least 6 characters" /> <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.password ? <small>{errors.password}</small> : null}</label>
            <label>Confirm Password<div className="password-field"><input type={showConfirmPassword ? 'text' : 'password'} value={values.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} placeholder="Repeat password" /> <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label="Toggle confirm password visibility">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.confirmPassword ? <small>{errors.confirmPassword}</small> : null}</label>
          </div>

          {status ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}
          <button type="submit" className="primary-button auth-submit">Create account <ArrowRight size={18} /></button>
        </form>

        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </div>
  )
}
