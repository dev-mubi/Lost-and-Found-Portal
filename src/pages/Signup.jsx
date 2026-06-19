import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
import logo from '../logo.png'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [sem, setSem] = useState('')
    const [dept, setDept] = useState('')
    const [regNo, setRegNo] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const emailRegex = /^[A-Z0-9.-]+@cuiatd\.edu\.pk$/i
        if (!emailRegex.test(email)) {
            setError('Please use a valid university email (e.g., FA23-BCS-133@cuiatd.edu.pk)')
            setLoading(false)
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    semester: sem,
                    department: dept,
                    registration_no: regNo,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: data.user.id,
                    full_name: fullName,
                    registration_no: regNo,
                    semester: sem,
                    department: dept,
                    role: 'student',
                }])

            if (profileError) {
                setError(profileError.message)
                setLoading(false)
                return
            }
        }

        setMessage('Registration successful. Please check your email for the verification link before signing in.')
        setTimeout(() => navigate('/login'), 5000)
        setLoading(false)
    }

    return (
        <div className="auth-page fade-in">
            <div className="auth-shell auth-shell-wide">
                <section className="auth-intro" aria-labelledby="signup-title">
                    <div className="auth-intro-copy">
                        <div className="auth-brand">
                            <span className="auth-logo-frame">
                                <img src={logo} alt="" className="auth-logo" />
                            </span>
                            <span className="auth-brand-name">Found it</span>
                        </div>
                        <p className="auth-kicker">Verified campus access</p>
                        <h1 id="signup-title">
                            <span>Create your recovery profile.</span>
                        </h1>
                        <p className="auth-lead">
                            Use your official student identity so item reports, ownership checks, and claim handoffs stay accountable.
                        </p>
                    </div>

                    <div className="auth-proof">
                        <div className="auth-proof-row">
                            <span>Email</span>
                            <strong>@cuiatd.edu.pk required</strong>
                        </div>
                        <div className="auth-proof-row">
                            <span>Identity</span>
                            <strong>Registration number, semester, and department</strong>
                        </div>
                        <div className="auth-proof-row">
                            <span>Next step</span>
                            <strong>Email verification before login</strong>
                        </div>
                    </div>
                </section>

                <section className="auth-card auth-card-large" aria-label="Create account form">
                    <div className="auth-card-header">
                        <p className="auth-eyebrow">Student registration</p>
                        <h2>Create Account</h2>
                        <p>Enter your details exactly as used by the university.</p>
                    </div>

                    {error && <div className="auth-alert auth-alert-error">{error}</div>}
                    {message && <div className="auth-alert auth-alert-success">{message}</div>}

                    <form onSubmit={handleSignup} className="auth-form">
                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-name">Full Name</label>
                            <input
                                id="signup-name"
                                className="form-control auth-input"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="auth-field-grid">
                            <div className="input-group">
                                <label className="input-label" htmlFor="signup-reg">Registration No</label>
                                <input
                                    id="signup-reg"
                                    className="form-control auth-input"
                                    placeholder="FA23-BCS-133"
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="signup-semester">Semester</label>
                                <select
                                    id="signup-semester"
                                    className="form-control auth-input"
                                    value={sem}
                                    onChange={(e) => setSem(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-dept">Department</label>
                            <input
                                id="signup-dept"
                                className="form-control auth-input"
                                placeholder="e.g. Computer Science"
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-email">Email Address</label>
                            <input
                                id="signup-email"
                                type="email"
                                className="form-control auth-input"
                                placeholder="reg_no@cuiatd.edu.pk"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <div className="auth-label-row">
                                <label className="input-label" htmlFor="signup-password">Password</label>
                                <button
                                    type="button"
                                    className="auth-text-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-control auth-input"
                                placeholder="Create a secure password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login" className="link">Sign In</Link>
                    </p>
                </section>
            </div>
        </div>
    )
}
