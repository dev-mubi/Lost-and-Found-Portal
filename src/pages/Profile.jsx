import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, GraduationCap, School, Calendar, Edit2, Save, X, Trash2, ArrowLeft } from 'lucide-react'

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

    const handleDeleteAccount = async () => {
        if (window.confirm('CRITICAL: Are you sure you want to delete your account? This action cannot be undone.')) {
            setUpdating(true)
            try {
                const { error } = await supabase.rpc('delete_user_account')
                if (error) throw error
                await supabase.auth.signOut()
                navigate('/login')
                alert('Your account has been deleted.')
            } catch (error) {
                setMessage({ type: 'error', content: 'Deletion failed: ' + error.message })
            } finally {
                setUpdating(false)
            }
        }
    }

    if (loading) return <div className="text-center" style={{ marginTop: '4rem' }}>Loading Profile...</div>

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', textAlign: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}
                        />
                    </div>
                    <h1>{fullName || 'User Profile'}</h1>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <Mail size={16} /> {user.email}
                    </p>

                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            <Edit2 size={18} /> Edit Profile
                        </button>
                    )}
                </div>

                {message.content && (
                    <div className={message.type === 'success' ? 'success-msg' : 'error-msg'} style={{ padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid', textAlign: 'center', background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                        {message.content}
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <div className="grid grid-2">
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Registration No</label>
                                <input className="form-control" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Semester</label>
                                <select className="form-control" value={sem} onChange={(e) => setSem(e.target.value)} required>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Department</label>
                                <input className="form-control" value={dept} onChange={(e) => setDept(e.target.value)} required />
                            </div>
                        </div>
                        <div className="input-group" style={{ marginTop: '1rem' }}>
                            <label className="input-label">Avatar URL</label>
                            <input className="form-control" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={updating}>
                                <Save size={18} /> {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1 }}>
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Registration Number</p>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <GraduationCap size={20} color="var(--primary)" /> {regNo}
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Semester</p>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Calendar size={20} color="var(--primary)" /> Semester {sem}
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px', gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Department / Program</p>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <School size={20} color="var(--primary)" /> {dept}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>Danger Zone</h3>
                    <p style={{ marginBottom: '2rem' }}>Once you delete your account, all your data will be permanently removed.</p>
                    <button onClick={handleDeleteAccount} className="btn" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                        <Trash2 size={18} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}
