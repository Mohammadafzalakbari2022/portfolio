import { useEffect, useState } from 'react'
import { auth, db, storage } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import './Admin.css'

function Admin() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('projects')

    // Project Form State
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [tech, setTech] = useState('')
    const [liveLink, setLiveLink] = useState('')
    const [image, setImage] = useState(null)
    const [pdf, setPdf] = useState(null)
    const [uploading, setUploading] = useState(false)

    // Auth Protection
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) navigate('/login')
        })
        return () => unsubscribe()
    }, [navigate])

    const handleLogout = () => {
        signOut(auth)
    }

    const handleProjectSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)

        try {
            let imageUrl = ''
            let pdfUrl = ''

            // Upload Image
            if (image) {
                const imageRef = ref(storage, `projects/${Date.now()}_${image.name}`)
                await uploadBytes(imageRef, image)
                imageUrl = await getDownloadURL(imageRef)
            }

            // Upload PDF
            if (pdf) {
                const pdfRef = ref(storage, `pdfs/${Date.now()}_${pdf.name}`)
                await uploadBytes(pdfRef, pdf)
                pdfUrl = await getDownloadURL(pdfRef)
            }

            // Add to Firestore
            await addDoc(collection(db, 'projects'), {
                title,
                description: desc,
                techStack: tech.split(',').map(t => t.trim()),
                liveLink,
                thumbnailUrl: imageUrl,
                pdfUrl: pdfUrl,
                createdAt: new Date()
            })

            alert('Project added successfully!')
            // Reset form
            setTitle(''); setDesc(''); setTech(''); setLiveLink(''); setImage(null); setPdf(null);
        } catch (error) {
            console.error(error)
            alert('Error uploading project')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'projects' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('projects')}
                >
                    Add Project
                </button>
                <button
                    className={activeTab === 'pricing' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('pricing')}
                >
                    Manage Pricing
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'projects' && (
                    <form onSubmit={handleProjectSubmit} className="admin-form">
                        <h2>New Project</h2>

                        <div className="form-group">
                            <label>Project Title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows="4" required />
                        </div>

                        <div className="form-group">
                            <label>Tech Stack (comma separated)</label>
                            <input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="React, Node.js, Firebase" required />
                        </div>

                        <div className="form-group">
                            <label>Live Link (Optional)</label>
                            <input value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Thumbnail Image</label>
                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </div>

                        <div className="form-group">
                            <label>Project PDF (Info/Brochure)</label>
                            <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Publish Project'}
                        </button>
                    </form>
                )}

                {activeTab === 'pricing' && (
                    <div className="coming-soon">
                        <h2>Pricing Manager</h2>
                        <p>Pricing management feature coming in next update.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Admin
