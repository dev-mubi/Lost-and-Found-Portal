import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Feedback() {
    const [email, setEmail] = useState('')
    const [regNo, setRegNo] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus('')

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            navigate('/login')
            return
        }

        const { error } = await supabase
            .from('feedback')
            .insert([
                {
                    registration_no: regNo,
                    email: email,
                    message: message
                }
            ])

        if (error) {
            setStatus('Error: ' + error.message)
        } else {
            setStatus('Success! Your message has been sent.')
            setMessage('')
            setEmail('')
            setRegNo('')
            setTimeout(() => navigate('/dashboard'), 2000)
        }
        setLoading(false)
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <Link to="/dashboard" className="link" style={{ marginBottom: '2rem', display: 'inline-block' }}>← Back to Dashboard</Link>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <h2 className="text-center">Send a Message</h2>
                <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Enter your details and message below.
                </p>

                {status && <div style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: status.includes('Success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.includes('Success') ? 'var(--success)' : 'var(--error)'
                }}>{status}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Registration Number</label>
                        <input
                            type="text"
                            placeholder="e.g. FA23-BCS-133"
                            value={regNo}
                            onChange={(e) => setRegNo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="yourname@cuiatd.edu.pk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How can we help you?"
                            required
                            style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', color: 'white', minHeight: '150px' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    )
}
