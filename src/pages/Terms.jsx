import { Link } from 'react-router-dom'

export default function Terms() {
    return (
        <div className="auth-container" style={{ alignItems: 'flex-start' }}>
            <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', width: '100%' }}>
                <Link to="/dashboard" className="link" style={{ marginBottom: '2rem', display: 'inline-block' }}>← Back</Link>
                <h1>Terms of Service</h1>
                <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
                    <h3>1. Usage Policy</h3>
                    <p>Only verified students and faculty of CUI are allowed to use this portal. Spam or fake reports will result in account suspension.</p>

                    <h3 style={{ marginTop: '1.5rem' }}>2. Data Privacy</h3>
                    <p>Your registration details are hidden from the public unless you choose to share them in the contact section of a report.</p>

                    <h3 style={{ marginTop: '1.5rem' }}>3. Verified Items</h3>
                    <p>CUI administration is not responsible for the items listed. Users must verify the identity of the person they are meeting on campus.</p>

                    <h3 style={{ marginTop: '1.5rem' }}>4. Content Content</h3>
                    <p>Images uploaded must be related to the lost/found item. Any inappropriate content will be automatically flagged and removed.</p>
                </div>
            </div>
        </div>
    )
}
