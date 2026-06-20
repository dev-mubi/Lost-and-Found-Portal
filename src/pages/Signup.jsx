import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
import logo from '../logo.png'
import { PRESET_AVATARS } from '../constants/avatars'

const SESSION_OPTIONS = [
    'FA01', 'FA02', 'FA03', 'FA04', 'FA05', 'FA06', 'FA07', 'FA08', 'FA09',
    'FA10', 'FA11', 'FA12', 'FA13', 'FA14', 'FA15', 'FA16', 'FA17', 'FA18',
    'FA19', 'FA20', 'FA21', 'FA22', 'FA23', 'FA24', 'FA25',
    'SP02', 'SP03', 'SP04', 'SP05', 'SP06', 'SP07', 'SP08', 'SP09', 'SP10',
    'SP11', 'SP12', 'SP13', 'SP14', 'SP15', 'SP16', 'SP17', 'SP18', 'SP19',
    'SP20', 'SP21', 'SP22', 'SP23', 'SP24', 'SP25', 'SP26'
]

const PROGRAM_OPTIONS = [
    'BBA', 'BBS', 'BCE', 'BCS', 'BDA', 'BDS', 'BEC', 'BEE', 'BEN', 'BES',
    'BIT', 'BMD', 'BML', 'BMT', 'BPY', 'BS (CE)', 'BSE', 'BSM', 'BTN', 'BTY',
    'CVE', 'EEE', 'EPE', 'ERS', 'GEO', 'HUM', 'MBA', 'MCS', 'MDS', 'MIT',
    'PBT', 'PCE', 'PCM', 'PCS', 'PCV', 'PDS', 'PEE', 'PES', 'PGO', 'PGP',
    'PHM', 'PMS', 'PMT', 'PPY', 'R05', 'RAI', 'RBA', 'RBF', 'RBT', 'RCE',
    'RCM', 'RCP', 'RCS', 'RCT', 'RCV', 'RDS', 'REC', 'REE', 'REN', 'RER',
    'RES', 'RMB', 'RMS', 'RMT', 'RPM', 'RPY', 'RSW'
]

export default function Signup() {
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [sem, setSem] = useState('')
    const [dept, setDept] = useState('')
    const [regSession, setRegSession] = useState('')
    const [regProgram, setRegProgram] = useState('')
    const [regRollNo, setRegRollNo] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()
    const formattedRollNo = regRollNo.padStart(3, '0')
    const regNo = regSession && regProgram && regRollNo ? `${regSession}-${regProgram}-${formattedRollNo}` : ''
    const generatedEmail = regNo ? `${regNo.toLowerCase()}@cuiatd.edu.pk` : ''

    const handleProgramChange = (program) => {
        setRegProgram(program)
        setDept(program)
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        if (!regSession || !regProgram || !regRollNo) {
            setError('Please select your session, program, and roll number.')
            setLoading(false)
            return
        }

        if (!/^\d{1,3}$/.test(regRollNo) || Number(regRollNo) < 1) {
            setError('Please enter a valid roll number between 001 and 999.')
            setLoading(false)
            return
        }

        const signupEmail = generatedEmail
        const randomAvatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].url

        const { data, error } = await supabase.auth.signUp({
            email: signupEmail,
            password,
            options: {
                data: {
                    full_name: fullName,
                    semester: sem,
                    department: dept,
                    registration_no: regNo,
                    avatar_url: randomAvatar,
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
                                <label className="input-label" htmlFor="signup-reg-session">Registration No</label>
                                <div className="auth-reg-builder">
                                    <select
                                        id="signup-reg-session"
                                        className="form-control auth-input auth-reg-select"
                                        value={regSession}
                                        onChange={(e) => setRegSession(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Session</option>
                                        {SESSION_OPTIONS.map(session => (
                                            <option key={session} value={session}>{session}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="form-control auth-input auth-reg-select"
                                        value={regProgram}
                                        onChange={(e) => handleProgramChange(e.target.value)}
                                        aria-label="Registration program"
                                        required
                                    >
                                        <option value="" disabled>Program</option>
                                        {PROGRAM_OPTIONS.map(program => (
                                            <option key={program} value={program}>{program}</option>
                                        ))}
                                    </select>

                                    <input
                                        className="form-control auth-input auth-reg-roll"
                                        inputMode="numeric"
                                        maxLength={3}
                                        placeholder="133"
                                        value={regRollNo}
                                        onChange={(e) => setRegRollNo(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        aria-label="Registration roll number"
                                        required
                                    />
                                </div>
                                <p className="auth-reg-preview">
                                    {regNo || 'Your registration number will appear here'}
                                </p>
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
                                className="form-control auth-input auth-input-readonly"
                                placeholder="Select program first"
                                value={dept}
                                readOnly
                                aria-readonly="true"
                            />
                            <p className="auth-reg-preview">Filled automatically from your selected program.</p>
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-email">Email Address</label>
                            <input
                                id="signup-email"
                                type="email"
                                className="form-control auth-input auth-input-readonly"
                                placeholder="Complete registration number first"
                                value={generatedEmail}
                                readOnly
                                aria-readonly="true"
                                autoComplete="email"
                            />
                            <p className="auth-reg-preview">Generated from your registration number.</p>
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
