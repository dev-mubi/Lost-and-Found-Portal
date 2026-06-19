import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'
import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, User, LogOut, LayoutDashboard, Bell, Tag, MapPin, X } from 'lucide-react'
import logo from '../logo.png'

export default function Layout({ children }) {
    const [user, setUser] = useState(null)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const navigate = useNavigate()
    const location = useLocation()
    const dropdownRef = useRef(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        }
        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    // Fetch initial notifications and setup realtime
    useEffect(() => {
        if (!user) return;

        const fetchInitialNotifications = async () => {
            const { data: lostData } = await supabase
                .from('lost_items')
                .select('id, item_name, location, created_at')
                .order('created_at', { ascending: false })
                .limit(5);

            const { data: foundData } = await supabase
                .from('found_items')
                .select('id, item_name, location, created_at')
                .order('created_at', { ascending: false })
                .limit(5);

            const combined = [
                ...(lostData || []).map(item => ({ ...item, type: 'lost' })),
                ...(foundData || []).map(item => ({ ...item, type: 'found' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);

            setNotifications(combined);
        }

        fetchInitialNotifications();

        // Subscribe to NEW records
        const lostChannel = supabase.channel('public:lost_items')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lost_items' }, payload => {
                const newItem = { ...payload.new, type: 'lost' };
                setNotifications(prev => [newItem, ...prev].slice(0, 8));
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        const foundChannel = supabase.channel('public:found_items')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'found_items' }, payload => {
                const newItem = { ...payload.new, type: 'found' };
                setNotifications(prev => [newItem, ...prev].slice(0, 8));
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(lostChannel);
            supabase.removeChannel(foundChannel);
        }
    }, [user])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setUnreadCount(0);
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    }

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

    return (
        <div className="app-container">
            {!isAuthPage && (
                <nav className="navbar">
                    <Link to="/dashboard" className="nav-logo" style={{ textDecoration: 'none' }}>
                        <img src={logo} alt="" className="nav-logo-mark" />
                        Found it
                    </Link>

                    <div className="nav-actions">
                        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user && (
                            <>
                                <div className="notification-wrapper" ref={dropdownRef}>
                                    <button onClick={handleNotificationClick} className="theme-toggle-btn" title="Notifications">
                                        <Bell size={20} />
                                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                                    </button>

                                    {showNotifications && (
                                        <div className="notification-dropdown">
                                            <div className="notification-header">
                                                <h3>Notifications</h3>
                                                <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="notification-list">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif, idx) => (
                                                        <Link
                                                            key={`${notif.type}-${notif.id}`}
                                                            to={notif.type === 'lost' ? '/lost' : '/found'}
                                                            className="notification-item"
                                                            onClick={() => setShowNotifications(false)}
                                                        >
                                                            <div className="notification-icon" style={{ background: notif.type === 'lost' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }}>
                                                                <Tag size={18} color={notif.type === 'lost' ? '#ef4444' : '#22c55e'} />
                                                            </div>
                                                            <div className="notification-content">
                                                                <div className="notification-title">
                                                                    New {notif.type} item: {notif.item_name}
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                                                                    <MapPin size={12} /> {notif.location}
                                                                </div>
                                                                <div className="notification-time">{formatTime(notif.created_at)}</div>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                        No new notifications
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                                                <Link to="/lost" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }} onClick={() => setShowNotifications(false)}>View All Reports</Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Link to="/dashboard" className="theme-toggle-btn" title="Dashboard">
                                    <LayoutDashboard size={20} />
                                </Link>
                                <Link to="/profile" className="theme-toggle-btn" title="Profile">
                                    <User size={20} />
                                </Link>
                                <button onClick={handleLogout} className="theme-toggle-btn" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            )}

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="footer-inner">
                    <p className="footer-copy">&copy; 2026 Found it - CUI Abbottabad</p>

                    <nav className="footer-links" aria-label="Footer navigation">
                        <Link to="/terms" className="footer-link">Terms of Service</Link>
                        <Link to="/about" className="footer-link">About</Link>
                        <Link to="/contact" className="footer-link">Contact</Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
