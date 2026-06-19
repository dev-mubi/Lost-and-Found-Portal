import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Upload, MapPin, Tag, Info, Phone, ArrowLeft, Send, X } from 'lucide-react'

export default function Report() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('lost')
    const [location, setLocation] = useState('')
    const [phone, setPhone] = useState('')
    const [showPhoneInput, setShowPhoneInput] = useState(false)
    const [image, setImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null)
            return
        }

        const objectUrl = URL.createObjectURL(image)
        setPreviewUrl(objectUrl)

        // Free memory
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])

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

    const removeImage = () => {
        setImage(null)
        setPreviewUrl(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            // Upload image to Supabase Storage
            let imageUrl = null;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('lost-found-image')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('lost-found-image')
                    .getPublicUrl(filePath);

                imageUrl = data.publicUrl;
            }

            // Contact information
            const defaultContact = `${user.email} (${user.user_metadata?.registration_no || 'N/A'})`;
            const finalContact =
                showPhoneInput && phone
                    ? `${defaultContact} | Phone: ${phone}`
                    : defaultContact;

            // Decide which table to insert into
            const tableName = type === 'lost' ? 'lost_items' : 'found_items';

            // Insert into database
            const { error } = await supabase
                .from(tableName)
                .insert([
                    {
                        user_id: user.id,
                        item_name: name,
                        description: description,
                        location: location,
                        image_url: imageUrl,
                        uploader_name: user.user_metadata?.full_name || '',
                        uploader_reg_no:
                            user.user_metadata?.registration_no || '',
                        contact: finalContact,
                    },
                ]);

            if (error) throw error;

            setMessage('Success! Your report has been submitted.');

            // Reset form
            setName('');
            setDescription('');
            setLocation('');
            setPhone('');
            setImage(null);
            setType('lost');
            setShowPhoneInput(false);

            setTimeout(() => {
                navigate(type === 'lost' ? '/lost' : '/found');
            }, 2000);
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="glass-card">
                <h2 style={{ marginBottom: '0.5rem' }}>Report an Item</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                    Provide accurate details to help the community.
                </p>

                {message && (
                    <div className={message.includes('Success') ? 'success-msg' : 'error-msg'} style={{ padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid', textAlign: 'center', background: message.includes('Success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="report-grid">
                        {/* Left Side: Information */}
                        <div className="report-form-side">
                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="input-label">Object Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input className="form-control" style={{ paddingLeft: '3rem' }} placeholder="e.g. Blue Wallet" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Type</label>
                                    <select className="form-control" value={type} onChange={(e) => setType(e.target.value)} required>
                                        <option value="lost">I Lost This</option>
                                        <option value="found">I Found This</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Location Found/Lost</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input className="form-control" style={{ paddingLeft: '3rem' }} placeholder="e.g. Library 2nd Floor" value={location} onChange={(e) => setLocation(e.target.value)} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Description</label>
                                <textarea className="form-control" style={{ minHeight: '120px' }} placeholder="Color, brand, distinguishing marks, contents..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={16} color="var(--primary)" /> Contact Information
                                </label>
                                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    Your registered Email and ID will be shared.
                                </div>

                                {!showPhoneInput ? (
                                    <button type="button" onClick={() => setShowPhoneInput(true)} className="btn" style={{ width: '100%', borderStyle: 'dashed' }}>
                                        <Phone size={18} /> Add Contact Number (Optional)
                                    </button>
                                ) : (
                                    <div className="fade-in">
                                        <label className="input-label">Phone Number</label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="tel" className="form-control" style={{ paddingLeft: '3rem' }} placeholder="+92 3XX XXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                        <button type="button" onClick={() => setShowPhoneInput(false)} className="link" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Remove phone number</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Media */}
                        <div className="report-media-side">
                            <label className="input-label">Item Picture</label>
                            <div className="preview-container">
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="preview-image" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <Upload size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                                        <p style={{ color: 'var(--text-muted)' }}>No image selected</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ position: 'relative', marginTop: '1rem' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                <button type="button" className="btn" style={{ width: '100%', pointerEvents: 'none' }}>
                                    <Upload size={18} /> {image ? 'Change Image' : 'Select Image'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Max size: 10MB (JPG, PNG, GIF)
                            </p>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '3rem', height: '54px' }} disabled={loading}>
                        {loading ? 'Submitting...' : (
                            <>
                                <Send size={20} /> Submit Report
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
