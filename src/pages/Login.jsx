import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
import logo from '../logo.png'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            navigate('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="auth-page fade-in">
            <div className="auth-shell">
                <section className="auth-intro" aria-labelledby="login-title">
                    <div className="auth-intro-copy">
                        <div className="auth-brand">
                            <span className="auth-logo-frame">
                                <img src={logo} alt="" className="auth-logo" />
                            </span>
                            <span className="auth-brand-name">Found it</span>
                        </div>
                        <p className="auth-kicker">Campus recovery workspace</p>
                        <h1 id="login-title">
                            <span>Recover what matters, faster.</span>
                        </h1>
                        <p className="auth-lead">
                            Sign in to manage reports, review campus listings, and follow up on item claims with less back-and-forth.
                        </p>
                    </div>

                    <div className="auth-proof">
                        <div className="auth-proof-row">
                            <span>Access</span>
                            <strong>University email accounts only</strong>
                        </div>
                        <div className="auth-proof-row">
                            <span>Use case</span>
                            <strong>Lost reports, found listings, and claim follow-ups</strong>
                        </div>
                        <div className="auth-proof-row">
                            <span>Campus</span>
                            <strong>CUI Abbottabad</strong>
                        </div>
                    </div>
                </section>

                <section className="auth-card" aria-label="Sign in form">
                    <div className="auth-card-header">
                        <p className="auth-eyebrow">Sign in</p>
                        <h2>Welcome back</h2>
                        <p>Sign in with the email and password you created.</p>
                    </div>

                    {error && <div className="auth-alert auth-alert-error">{error}</div>}

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="input-group">
                            <label className="input-label" htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
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
                                <label className="input-label" htmlFor="login-password">Password</label>
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
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-control auth-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/signup" className="link">Create one</Link>
                    </p>
                </section>
            </div>
        </div>
    )
}
