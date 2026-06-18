import { Link } from 'react-router-dom'

export default function Contact() {
    return (
        <div className="auth-container" style={{ alignItems: 'flex-start' }}>
            <div className="glass-card" style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                <Link to="/dashboard" className="link" style={{ marginBottom: '2rem', display: 'block', textAlign: 'left' }}>← Back</Link>
                <h1>Contact Us</h1>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Get in touch with the developer.</p>

                <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <h3>📧 Email</h3>
                        <a href="mailto:wafaamjad058@gmail.com" className="link" style={{ fontSize: '1.1rem' }}>wafaamjad058@gmail.com</a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <a href="https://github.com/WafaAmjad" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#24292e', color: 'white', justifyContent: 'center' }}>
                            GitHub
                        </a>
                        <a href="https://linkedin.com/in/wafa-amjad" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#0077b5', color: 'white', justifyContent: 'center' }}>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
