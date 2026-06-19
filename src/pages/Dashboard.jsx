import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Search, CheckCircle, MessageSquare, List } from 'lucide-react'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                navigate('/login')
            } else {
                setUser(session.user)
            }
        }
        getSession()
    }, [navigate])

    if (!user) return <div className="text-center" style={{ marginTop: '4rem' }}>Loading Dashboard...</div>

    return (
        <div className="fade-in">
            <header className="glass-card" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '1rem' }}>Welcome {user.user_metadata?.full_name?.split(' ')[0] || 'Member'}!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    What would you like to do today? You can report a new item or browse the community listings.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/report" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        <Plus size={20} /> Report an Item
                    </Link>
                    <Link to="/feedback" className="btn" style={{ padding: '1rem 2rem' }}>
                        <MessageSquare size={20} /> Send a Message
                    </Link>
                </div>
            </header>

            <div className="grid grid-3">
                <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/lost')}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444' }}>
                        <Search size={28} />
                    </div>
                    <h2>Lost Items</h2>
                    <p style={{ margin: '1rem 0' }}>Browse items that have been reported as lost by other students.</p>
                    <Link to="/lost" className="link">View Gallery →</Link>
                </div>

                <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/found')}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#22c55e' }}>
                        <CheckCircle size={28} />
                    </div>
                    <h2>Found Items</h2>
                    <p style={{ margin: '1rem 0' }}>Check the list of items found on campus to see if yours is there.</p>
                    <Link to="/found" className="link">View Gallery →</Link>
                </div>

                <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/report')}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                        <Plus size={28} />
                    </div>
                    <h2>New Report</h2>
                    <p style={{ margin: '1rem 0' }}>Quickly submit a report for a lost or found item with details and images.</p>
                    <Link to="/report" className="link">Submit Now →</Link>
                </div>
            </div>

            <section style={{ marginTop: '3rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <List size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ margin: 0 }}>Community Guidelines</h2>
                    </div>
                    <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li>Always upload a clear photo of the item for faster identification.</li>
                        <li>Provide accurate locations (e.g. S102 , Canteen , Library(C-Block)).</li>
                        <li>Verification will be required when claiming high-value items.</li>
                        <li>Respect privacy and coordinate safely on campus.</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
