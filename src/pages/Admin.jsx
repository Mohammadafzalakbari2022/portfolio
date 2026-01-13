import { useEffect, useState } from 'react'
import { auth, db, storage } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Plus, Trash2 } from 'lucide-react'
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

    // Skills State
    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState({ name: '', percentage: 50, color: '#3b82f6' })

    const fetchSkills = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'skills'))
            setSkills(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        } catch (error) {
            console.error("Error fetching skills:", error)
        }
    }

    useEffect(() => {
        if (activeTab === 'skills') {
            fetchSkills()
        }
    }, [activeTab])

    const handleAddSkill = async () => {
        if (!newSkill.name) return
        try {
            await addDoc(collection(db, 'skills'), newSkill)
            setNewSkill({ name: '', percentage: 50, color: '#3b82f6' })
            fetchSkills()
            alert('Skill added successfully!')
        } catch (error) {
            console.error("Error adding skill:", error)
            alert('Error adding skill')
        }
    }

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return
        try {
            await deleteDoc(doc(db, 'skills', id))
            fetchSkills()
        } catch (error) {
            console.error("Error deleting skill:", error)
            alert('Error deleting skill')
        }
    }

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

                {activeTab === 'skills' && (
                    <div className="admin-container">
                        <h1 className="admin-title">Admin Dashboard</h1>

                        <div className="admin-grid">
                            {/* Add Skill Form */}
                            <div className="card glass">
                                <h2 className="card-title">Add New Skill</h2>
                                <div className="form-group">
                                    <label>Skill Name</label>
                                    <input
                                        type="text"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                        placeholder="e.g. React"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Proficiency ({newSkill.percentage}%)</label>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={newSkill.percentage}
                                        onChange={(e) => setNewSkill({ ...newSkill, percentage: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Color</label>
                                    <input
                                        type="color"
                                        value={newSkill.color}
                                        onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                                        style={{ width: '100%', height: '40px', padding: 0, border: 'none' }}
                                    />
                                </div>
                                <button className="btn btn-primary w-full" onClick={handleAddSkill}>
                                    <Plus size={18} /> Add Skill
                                </button>
                            </div>

                            {/* Skills List */}
                            <div className="card glass">
                                <h2 className="card-title">Manage Skills</h2>
                                <div className="skills-list">
                                    {skills.map(skill => (
                                        <div key={skill.id} className="skill-item">
                                            <div className="skill-info">
                                                <span className="skill-color" style={{ backgroundColor: skill.color }}></span>
                                                <span>{skill.name}</span>
                                                <span className="skill-pct">{skill.percentage}%</span>
                                            </div>
                                            <button className="btn-icon danger" onClick={() => handleDeleteSkill(skill.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {skills.length === 0 && <p className="text-muted">No skills added yet.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Admin
