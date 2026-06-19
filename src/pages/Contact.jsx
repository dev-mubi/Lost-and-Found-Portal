import { Link } from 'react-router-dom'
import { Mail, Globe, User, ArrowLeft, MessageCircle } from 'lucide-react'

export default function Contact() {
    return (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                    <MessageCircle size={32} />
                </div>
                <h1>Contact the Developer</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Have questions or want to collaborate? Reach out through any of these platforms.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <a href="mailto:wafaamjad058@gmail.com" className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', transition: 'var(--transition)' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '10px', color: 'var(--primary)' }}>
                            <Mail size={24} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Me</p>
                            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>wafaamjad058@gmail.com</p>
                        </div>
                    </a>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <a href="https://github.com/Wafa-Amjad" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#24292e', color: 'white', border: 'none', height: '54px' }}>
                            <Globe size={20} /> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/wafa-a-639a78329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#0077b5', color: 'white', border: 'none', height: '54px' }}>
                            <User size={20} /> LinkedIn
                        </a>
                    </div>
                </div>


                <p style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Made for the CUI Community.
                </p>
            </div>
        </div>
    )
}
