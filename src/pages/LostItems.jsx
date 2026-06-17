import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Link } from 'react-router-dom'

export default function LostItems() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLostItems = async () => {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('type', 'lost')
                .order('created_at', { ascending: false })

            if (!error) setItems(data)
            setLoading(false)
        }
        fetchLostItems()
    }, [])

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/dashboard" className="link">← Back</Link>
                <h1 style={{ margin: 0 }}>Lost Items</h1>
                <Link to="/report" className="btn btn-primary">Report My Loss</Link>
            </header>

            {loading ? <div className="text-center">Loading...</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {items.map(item => (
                        <div key={item.id} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Object: {item.name}</h3>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>Lost</span>
                            </div>
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.75rem', marginTop: '1rem' }}
                                />
                            )}
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '1rem 0' }}><strong>Description:</strong> {item.description}</p>
                            <div style={{ fontSize: '0.875rem' }}>
                                <p>📍 <strong>Location:</strong> {item.location}</p>
                                <p>📞 <strong>Contact:</strong> {item.contact_info}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
                                    Posted on {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-center" style={{ gridColumn: '1/-1' }}>No lost items reported yet.</p>}
                </div>
            )}
        </div>
    )
}
