import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const initialValues = { email: 'student@example.com', password: 'student123' }

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, setIsLoading } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState(null)

  function validate() {
    const nextErrors = {}

    if (!values.email.trim()) nextErrors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Please enter a valid email'
    if (!values.password) nextErrors.password = 'Password is required'
    else if (values.password.length < 6) nextErrors.password = 'Password must contain at least 6 characters'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus(null)
    if (!validate()) return

    setIsLoading(true)
    const result = login(values.email.trim(), values.password)
    setIsLoading(false)

    if (!result.success) {
      setStatus({ type: 'error', message: result.message })
      return
    }

    const destination = location.state?.from?.pathname || '/dashboard'
    navigate(destination, { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="auth-illustration">
        <div className="auth-brand"><GraduationCap size={32} /> Student Placement</div>
        <h1>Launch your career with the right opportunity.</h1>
        <p>Track applications, prepare interviews, and discover companies that match your goals.</p>
        <div className="auth-highlight-grid">
          <div><strong>42+</strong><span>Jobs available</span></div>
          <div><strong>12</strong><span>Applications</span></div>
          <div><strong>4</strong><span>Interviews</span></div>
        </div>
      </div>

      <section className="auth-card">
        <div className="auth-header">
          <span className="pill blue">Student portal</span>
          <h2>Welcome back</h2>
          <p>Sign in to continue your placement journey.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label>
            Email address
            <input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="student@example.com" />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label>
            Password
            <div className="password-field">
              <input type={showPassword ? 'text' : 'password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="Enter password" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {errors.password ? <small>{errors.password}</small> : null}
          </label>

          {status ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}
          <button type="submit" className="primary-button auth-submit">Sign in <ArrowRight size={18} /></button>
        </form>

        <p className="auth-switch">New student? <Link to="/register">Create an account</Link></p>
        <div className="demo-box">
          <span>Demo credentials</span>
          <strong>student@example.com</strong>
          <strong>student123</strong>
        </div>
      </section>
    </div>
  )
}
