import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [fullName, setFullName] = useState('')
    const [regNo, setRegNo] = useState('')
    const [sem, setSem] = useState('')
    const [dept, setDept] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [message, setMessage] = useState({ type: '', content: '' })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
                return
            }
            setUser(user)
            setFullName(user.user_metadata?.full_name || '')
            setRegNo(user.user_metadata?.registration_no || '')
            setSem(user.user_metadata?.semester || '')
            setDept(user.user_metadata?.department || '')
            setAvatarUrl(user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.email)
            setLoading(false)
        }
        fetchUser()
    }, [navigate])

    const handleUpdate = async (e) => {
        e.preventDefault()
        setUpdating(true)
        setMessage({ type: '', content: '' })

        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: fullName,
                registration_no: regNo,
                semester: sem,
                department: dept,
                avatar_url: avatarUrl
            }
        })

        if (error) {
            setMessage({ type: 'error', content: error.message })
        } else {
            setMessage({ type: 'success', content: 'Profile updated successfully!' })
            setIsEditing(false)
        }
        setUpdating(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const handleDeleteAccount = async () => {
        if (window.confirm('CRITICAL: Are you sure you want to delete your account? This will remove all your data permanently. This action cannot be undone.')) {
            setUpdating(true)
            try {
                // We call an RPC function. You MUST add this function in Supabase SQL Editor (check my instructions).
                const { error } = await supabase.rpc('delete_user_account')

                if (error) throw error

                // Sign out locally
                await supabase.auth.signOut()
                navigate('/login')
                alert('Your account has been successfully deleted.')
            } catch (error) {
                console.error(error)
                setMessage({ type: 'error', content: 'Deletion failed: ' + error.message })
            } finally {
                setUpdating(false)
            }
        }
    }

    if (loading) return <div className="text-center mt-4">Loading Profile...</div>

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" className="link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem' }}>
                    Logout
                </button>
            </div>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)', marginBottom: '1.5rem' }}
                    />
                    <h1>{fullName || 'User Profile'}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-primary"
                            style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {message.content && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '2rem',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                        {message.content}
                    </div>
                )}

                {!isEditing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="detail-group">
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{fullName}</div>
                        </div>
                        <div className="detail-group">
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Registration Number</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{regNo}</div>
                        </div>
                        <div className="detail-group">
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Semester</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{sem}</div>
                        </div>
                        <div className="detail-group">
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Department</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{dept}</div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Registration Number</label>
                                <input value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Semester</label>
                                <select
                                    value={sem}
                                    onChange={(e) => setSem(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '1.1rem' }}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n} style={{ background: '#1e1b4b' }}>{n}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <input value={dept} onChange={(e) => setDept(e.target.value)} required />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Avatar URL</label>
                                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.png" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={updating}>
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                    <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Danger Zone</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button onClick={handleDeleteAccount} className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}
