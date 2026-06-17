import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Report() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('lost')
    const [location, setLocation] = useState('')
    const [phone, setPhone] = useState('')
    const [showPhoneInput, setShowPhoneInput] = useState(false)
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File size exceeds 10MB limit.")
                e.target.value = null
                return
            }
            setImage(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
                return
            }

            let imageUrl = null

            // Upload image if selected
            if (image) {
                const fileExt = image.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                const { error: uploadError, data } = await supabase.storage
                    .from('item-images')
                    .upload(filePath, image)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('item-images')
                    .getPublicUrl(filePath)

                imageUrl = publicUrl
            }

            const defaultContact = `${user.email} (${user.user_metadata?.registration_no || 'N/A'})`
            const finalContact = showPhoneInput && phone ? `${defaultContact} | Phone: ${phone}` : defaultContact

            const { error } = await supabase
                .from('items')
                .insert([
                    {
                        name,
                        description,
                        type,
                        location,
                        contact_info: finalContact,
                        image_url: imageUrl,
                        user_id: user.id
                    }
                ])

            if (error) throw error

            setMessage('Success! Your report has been submitted.')
            setTimeout(() => navigate(type === 'lost' ? '/lost' : '/found'), 2000)
        } catch (error) {
            setMessage('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
            <Link to="/dashboard" className="link" style={{ marginBottom: '2rem', display: 'inline-block' }}>← Back to Dashboard</Link>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <h2 className="text-center">Report an Item</h2>
                <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Fill in the details below to help us track the item.
                </p>

                {message && <div style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: message.includes('Success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.includes('Success') ? 'var(--success)' : 'var(--error)'
                }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Object (Item Name)</label>
                        <input placeholder="e.g. Black Wallet, Keys" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label>Image (Max 10MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '0.8rem' }}
                        />
                    </div>

                    <div className="input-group">
                        <label>Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="input-field" style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', color: 'white' }}>
                            <option value="lost" style={{ background: '#1e1b4b' }}>I Lost This</option>
                            <option value="found" style={{ background: '#1e1b4b' }}>I Found This</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Location</label>
                        <input placeholder="e.g. Library, Cafe" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Color, brand, distinguishing marks..."
                            required
                            style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', color: 'white', minHeight: '100px' }}
                        />
                    </div>

                    <div className="input-group">
                        <label>Contact Info</label>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            Default: Email + Registration Number
                        </div>

                        {!showPhoneInput ? (
                            <button
                                type="button"
                                onClick={() => setShowPhoneInput(true)}
                                className="btn"
                                style={{ background: 'transparent', border: '1px dashed var(--primary)', color: 'var(--primary)', width: '100%', padding: '0.5rem' }}
                            >
                                + Add Phone Number (Recommended)
                            </button>
                        ) : (
                            <div className="input-group">
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    )
}
