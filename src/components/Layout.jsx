import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'
import { useState, useEffect } from 'react'
import { Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react'

export default function Layout({ children }) {
    const [user, setUser] = useState(null)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
    const navigate = useNavigate()
    const location = useLocation()

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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    // Hide navbar links on auth pages if needed, but the user wants it fixed everywhere for consistency
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

    return (
        <div className="app-container">
            {!isAuthPage && (
                <nav className="navbar">
                    <div className="nav-logo">
                        Lost & Found Portal
                    </div>

                    <div className="nav-actions">
                        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user && (
                            <>
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
                <div className="footer-links">
                    <Link to="/terms" className="footer-link">Terms of Service</Link>
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                </div>
                <p className="footer-link">© 2026 Lost & Found Portal - CUI Abbottabad</p>
            </footer>
        </div>
    )
}
