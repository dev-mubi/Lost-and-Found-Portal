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
                    <div className="fade-in">
                        {filteredItems.map(item => (
                            <div key={item.id} className="glass-card item-card-horizontal fade-in">
                                <div className="item-card-content">
                                    <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.5rem' }}>{item.item_name}</h2>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', margin: 0 }}>
                                            <MapPin size={18} style={{ color: 'var(--error)' }} /> {item.location}
                                        </p>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', margin: 0 }}>
                                            <Calendar size={18} /> {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', flex: 1 }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Description</p>
                                        <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>{item.description}</p>
                                    </div>

                                    <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--error)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>CONTACT INFO</p>
                                        <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>{item.contact}</p>
                                    </div>
                                </div>

                                <div className="item-card-image-box">
                                    <span className="item-badge" style={{ background: 'var(--error)' }}>LOST</span>
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.item_name} className="item-card-image" />
                                    ) : (
                                        <div style={{ textAlign: 'center', opacity: 0.3 }}>
                                            <Search size={48} style={{ marginBottom: '0.5rem' }} />
                                            <p style={{ fontSize: '0.8rem', margin: 0 }}>No Image</p>
                                        </div>
                                    )}
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
