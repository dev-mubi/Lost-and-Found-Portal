import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { MessageSquare, Mail, GraduationCap, Send, ArrowLeft } from 'lucide-react'

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
            .insert([{
                registration_no: regNo,
                email: email,
                message: message
            }])

        if (error) {
            setStatus('Error: ' + error.message)
        } else {
            setStatus('Success! Your message has been sent.')
            setMessage('')
            setEmail('')
            setRegNo('')
            setTimeout(() => navigate('/dashboard'), 3000)
        }
        setLoading(false)
    }

    return (
        <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                        <MessageSquare size={28} />
                    </div>
                    <h2>Send a Message</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Found a bug? Have a suggestion? We'd love to hear from you.</p>
                </div>

                {status && (
                    <div className={status.includes('Success') ? 'success-msg' : 'error-msg'} style={{ padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid', textAlign: 'center', background: status.includes('Success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                        {status}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2">
                        <div className="input-group">
                            <label className="input-label">Registration Number</label>
                            <div style={{ position: 'relative' }}>
                                <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '3rem' }} placeholder="FA23-BCS-133" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="email" className="form-control" style={{ paddingLeft: '3rem' }} placeholder="name@cuiatd.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '1.5rem' }}>
                        <label className="input-label">Message</label>
                        <textarea className="form-control" style={{ minHeight: '160px' }} placeholder="Type your message here..." value={message} onChange={(e) => setMessage(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', height: '54px' }} disabled={loading}>
                        {loading ? 'Sending...' : (
                            <>
                                <Send size={20} /> Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
