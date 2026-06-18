import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, School, ArrowRight } from 'lucide-react'

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

        setMessage('Registration successful! Please check your email for the verification link. Click the link to verify your account, and then you can login to the portal.')
        setTimeout(() => navigate('/login'), 5000)
        setLoading(false)
    }

    return (
        <div className="auth-page fade-in">
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>Welcome to</p>
                <h1>Lost & Found Portal</h1>
            </div>

            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Join the university community</p>

                {error && <div className="error-msg" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--error)' }}>{error}</div>}
                {message && <div className="success-msg" style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--success)', color: 'var(--success)' }}>{message}</div>}

                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="form-control"
                                placeholder="Enter your full name"
                                style={{ paddingLeft: '3rem' }}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label className="input-label">Registration No</label>
                            <div style={{ position: 'relative' }}>
                                <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="form-control"
                                    placeholder="FA23-BCS-133"
                                    style={{ paddingLeft: '3rem' }}
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Semester</label>
                            <select
                                className="form-control"
                                value={sem}
                                onChange={(e) => setSem(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Department</label>
                        <div style={{ position: 'relative' }}>
                            <School size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="form-control"
                                placeholder="e.g. Computer Science"
                                style={{ paddingLeft: '3rem' }}
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@cuiatd.edu.pk"
                                style={{ paddingLeft: '3rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="••••••••"
                                style={{ paddingLeft: '3rem', paddingRight: '3.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '50px' }} disabled={loading}>
                        {loading ? 'Creating...' : (
                            <>
                                Create Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" className="link">Sign In</Link>
                </p>
            </div>
        </div>
    )
}
