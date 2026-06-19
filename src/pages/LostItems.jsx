import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Info, Search, ArrowLeft, Plus } from 'lucide-react'

export default function LostItems() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchLostItems = async () => {
            const { data, error } = await supabase
                .from('lost_items')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error) setItems(data)
            else console.log(error)
            setLoading(false)
        }
        fetchLostItems()
    }, [])

    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Lost Items</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gallery of items reported as lost by the community</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/dashboard" className="btn">
                        <ArrowLeft size={18} /> Back
                    </Link>
                    <Link to="/report" className="btn btn-primary">
                        <Plus size={18} /> Report Lost Item
                    </Link>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search by object name or location..."
                    className="form-control"
                    style={{ border: 'none', background: 'transparent', padding: '0.5rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '4rem' }}>Loading items...</div>
            ) : (
                <>
                    <div className="grid grid-3">
                        {filteredItems.map(item => (
                            <div key={item.id} className="glass-card fade-in" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative', height: '220px' }}>
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.item_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Search size={40} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                                                <p style={{ fontSize: '0.875rem' }}>No Image Provided</p>
                                            </div>
                                        </div>
                                    )}
                                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '700' }}>LOST</span>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-main)' }}>{item.item_name}</h3>

                                    <div style={{ fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={16} style={{ color: 'var(--primary)' }} /> {item.location}
                                        </p>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={16} /> {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Description</p>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>
                                    </div>

                                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>CONTACT INFO</p>
                                        <p style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>{item.contact}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="glass-card text-center" style={{ padding: '4rem' }}>
                            <Info size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                            <h3>No items found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>We couldn't find any items matching your search.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
