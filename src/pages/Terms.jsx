import { Link } from 'react-router-dom'
import { Shield, Lock, AlertTriangle, FileText, ArrowLeft } from 'lucide-react'

export default function Terms() {
    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', color: 'var(--primary)' }}>
                    <Shield size={32} />
                    <h1 style={{ margin: 0 }}>Terms of Service</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                            <Lock size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>1. Usage Policy</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Access to this portal is strictly limited to verified students and faculty of COMSATS University Islamabad (CUI). Any reports found to be fraudulent, spammy, or misleading will result in immediate account suspension and potential disciplinary action.
                        </p>
                    </section>

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                            <Shield size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>2. Data Privacy</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Your privacy is important to us. Your registration details and personal information are encrypted and only shared with others when you explicitly provide them in your report's contact section.
                        </p>
                    </section>

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                            <AlertTriangle size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>3. Responsibility</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            CUI and the portal administrators are not responsible for the items listed or for any interactions between users. It is mandatory for users to meet in safe, public campus areas to exchange items and verify identities.
                        </p>
                    </section>

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                            <FileText size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>4. Content Standards</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            All images and descriptions must be accurate and appropriate. Any content deemed offensive, irrelevant, or in violation of university guidelines will be removed without prior notice.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
