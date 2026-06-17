import { useState } from 'react'
import { supabase } from '../supabase'
import { Link, useNavigate } from 'react-router-dom'

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

        // University email validation
        const emailRegex = /^[A-Z0-9.-]+@cuiatd\.edu\.pk$/i

        if (!emailRegex.test(email)) {
            setError(
                'Please use a valid university email (e.g., FA23-BCS-133@cuiatd.edu.pk)'
            )
            setLoading(false)
            return
        }

        // Create user in Supabase Authentication
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

        // Save additional user details in the profiles table
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        full_name: fullName,
                        registration_no: regNo,
                        semester: sem,
                        department: dept,
                        role: 'student',
                    },
                ])

            if (profileError) {
                setError(profileError.message)
                setLoading(false)
                return
            }
        }

        setMessage(
            'Registration successful! Please check your email for verification.'
        )

        setTimeout(() => {
            navigate('/login')
        }, 3000)

        setLoading(false)
    }

    return (
        <div className="auth-container">
            <div
                className="auth-box glass-card"
                style={{ maxWidth: '600px' }}
            >
                <h2 className="text-center">Create Account</h2>

                <p
                    className="text-center"
                    style={{
                        color: 'var(--text-muted)',
                        marginBottom: '2rem',
                    }}
                >
                    Join the Lost and Found Portal
                </p>

                {error && (
                    <div className="error-msg">
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        style={{
                            color: 'var(--success)',
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1.5rem',
                        }}
                    >
                        <div className="input-group">
                            <label>Registration Number</label>
                            <input
                                type="text"
                                placeholder="FA23-BCS-133"
                                value={regNo}
                                onChange={(e) =>
                                    setRegNo(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Semester</label>
                            <select
                                value={sem}
                                onChange={(e) =>
                                    setSem(e.target.value)
                                }
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background:
                                        'rgba(15, 23, 42, 0.5)',
                                    border:
                                        '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <option
                                    value=""
                                    disabled
                                    style={{
                                        background: '#1e1b4b',
                                    }}
                                >
                                    Select
                                </option>

                                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                    (n) => (
                                        <option
                                            key={n}
                                            value={n}
                                            style={{
                                                background:
                                                    '#1e1b4b',
                                            }}
                                        >
                                            {n}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Department</label>
                        <input
                            type="text"
                            placeholder="Computer Science"
                            value={dept}
                            onChange={(e) =>
                                setDept(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="FA23-BCS-133@cuiatd.edu.pk"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                        }}
                        disabled={loading}
                    >
                        {loading
                            ? 'Creating account...'
                            : 'Sign Up'}
                    </button>
                </form>

                <p
                    className="text-center mt-4"
                    style={{ fontSize: '1rem' }}
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="link"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}