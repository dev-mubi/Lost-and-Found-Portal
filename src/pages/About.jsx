import { Link } from 'react-router-dom'

export default function About() {
    return (
        <div className="auth-container" style={{ alignItems: 'flex-start' }}>
            <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', width: '100%' }}>
                <Link to="/dashboard" className="link" style={{ marginBottom: '2rem', display: 'inline-block' }}>← Back</Link>
                <h1>About Lost & Found Portal</h1>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Welcome to the specialized Lost and Found Portal for CUI. Our platform is designed to bridge the gap between finders and owners within the university campus.
                </p>
                <h3 style={{ marginTop: '2rem' }}>Our Mission</h3>
                <p>
                    To create a transparent, efficient, and secure environment where students and staff can recover their lost belonging through community cooperation and digital tracking.
                </p>
                <h3 style={{ marginTop: '2rem' }}>How it Works</h3>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                    <li>Report any item you find with a photo and location.</li>
                    <li>Browse the lost items gallery if you've misplaced something.</li>
                    <li>Connect safely with students via verified university email and registration details.</li>
                </ul>
            </div>
        </div>
    )
}
