import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import LostItems from './pages/LostItems'
import FoundItems from './pages/FoundItems'
import Report from './pages/Report'
import Feedback from './pages/Feedback'
import About from './pages/About'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import ThemeToggle from './components/ThemeToggle'
import './index.css'

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lost" element={<LostItems />} />
        <Route path="/found" element={<FoundItems />} />
        <Route path="/report" element={<Report />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
