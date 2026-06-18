import { Link } from 'react-router-dom'
import { Info, Target, HelpCircle, ArrowLeft } from 'lucide-react'

export default function About() {
    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <Info size={32} />
                    <h1 style={{ margin: 0 }}>About the Portal</h1>
                </div>

                <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                    The CUI Lost & Found Portal is a dedicated platform designed to help students and staff within the university community safely recover lost items and report found belongings.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                    <Target size={24} />
                    <h3 style={{ margin: 0 }}>Our Mission</h3>
                </div>
                <p style={{ marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    Our mission is to foster a culture of honesty and community support at CUI. By providing a centralized digital hub, we make it easier, faster, and more secure to reconnect lost items with their rightful owners.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                    <HelpCircle size={24} />
                    <h3 style={{ margin: 0 }}>How it Works</h3>
                </div>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6' }}>
                    <li><strong>Report:</strong> If you find an item, upload a photo and mention where you found it.</li>
                    <li><strong>Search:</strong> If you lost an item, browse the "Lost Items" gallery or search for specific keywords.</li>
                    <li><strong>Claim:</strong> Coordinate a safe meeting on campus to verify and return the item.</li>
                </ul>
            </div>
        </div>
    )
}
