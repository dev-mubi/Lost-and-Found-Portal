import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

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

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login')
            } else {
                setUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    if (!user) return <div className="text-center mt-4">Loading...</div>

    return (
        <div style={{ padding: '2rem' }}>
            <nav className="glass-card" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderRadius: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>Lost & Found Portal</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/profile" className="link" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                            src={user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.email}
                            alt="Avatar"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--primary)' }}
                        />
                        View Profile
                    </Link>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem' }}>
                        Logout
                    </button>
                </div>
            </nav>

            <main>
                <header className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                    <h1>Welcome to the Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
                        The central hub for reporting and finding lost items at CUI.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                        <Link to="/report" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ➕ Report Item
                        </Link>
                        <Link to="/lost" className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            🔍 Lost Items
                        </Link>
                        <Link to="/found" className="btn" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ✅ Found Items
                        </Link>
                        <Link to="/feedback" className="btn" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)', border: '1px solid rgba(255, 255, 255, 0.1)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            💬 Feedback
                        </Link>
                    </div>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3>Your Recent Activity</h3>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't posted any items yet.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3>Recent Found Items</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong>Blue Backpack</strong>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Found in Cafeteria - 2 hours ago</p>
                            </div>
                            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong>iPhone 13 (Black)</strong>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Found in Library - 5 hours ago</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
