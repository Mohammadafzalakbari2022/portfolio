import { useEffect, useState } from 'react'
import { auth, db, storage } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Plus, Trash2, LogOut, Package, Briefcase, GraduationCap } from 'lucide-react'
import './Admin.css'

function Admin() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('projects')
    const [uploading, setUploading] = useState(false)

    // Project Form State
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [tech, setTech] = useState('')
    const [liveLink, setLiveLink] = useState('')
    const [image, setImage] = useState(null)
    const [pdf, setPdf] = useState(null)

    // Skills State
    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState({ name: '', percentage: 50, color: '#3b82f6' })

    // Pricing State
    const [plans, setPlans] = useState([])
    const [newPlan, setNewPlan] = useState({ title: '', price: '', features: '', recommended: false })

    // Auth Protection
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) navigate('/login')
        })
        return () => unsubscribe()
    }, [navigate])

    // Data Fetching
    const fetchSkills = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'skills'))
            setSkills(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        } catch (error) {
            console.error("Error fetching skills:", error)
        }
    }

    const fetchPricing = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'pricing'))
            setPlans(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        } catch (error) {
            console.error("Error fetching pricing:", error)
        }
    }

    useEffect(() => {
        if (activeTab === 'skills') fetchSkills()
        if (activeTab === 'pricing') fetchPricing()
    }, [activeTab])

    const handleLogout = () => {
        signOut(auth)
    }

    // Handlers
    const handleProjectSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)
        try {
            let imageUrl = ''
            let pdfUrl = ''

            if (image) {
                const imageRef = ref(storage, `projects/${Date.now()}_${image.name}`)
                await uploadBytes(imageRef, image)
                imageUrl = await getDownloadURL(imageRef)
            }

            if (pdf) {
                const pdfRef = ref(storage, `pdfs/${Date.now()}_${pdf.name}`)
                await uploadBytes(pdfRef, pdf)
                pdfUrl = await getDownloadURL(pdfRef)
            }

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
            setTitle(''); setDesc(''); setTech(''); setLiveLink(''); setImage(null); setPdf(null);
        } catch (error) {
            console.error(error)
            alert('Error uploading project: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleAddSkill = async () => {
        if (!newSkill.name) return
        try {
            await addDoc(collection(db, 'skills'), newSkill)
            setNewSkill({ name: '', percentage: 50, color: '#3b82f6' })
            fetchSkills()
            alert('Skill added!')
        } catch (error) {
            alert('Error adding skill')
        }
    }

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('Delete this skill?')) return
        try {
            await deleteDoc(doc(db, 'skills', id))
            fetchSkills()
        } catch (error) {
            alert('Error deleting skill')
        }
    }

    const handleAddPricing = async () => {
        if (!newPlan.title || !newPlan.price) return
        try {
            const planToSave = {
                ...newPlan,
                features: newPlan.features.split(',').map(f => f.trim()).filter(f => f !== '')
            }
            await addDoc(collection(db, 'pricing'), planToSave)
            setNewPlan({ title: '', price: '', features: '', recommended: false })
            fetchPricing()
            alert('Pricing plan added!')
        } catch (error) {
            alert('Error adding pricing')
        }
    }

    const handleDeletePricing = async (id) => {
        if (!window.confirm('Delete this plan?')) return
        try {
            await deleteDoc(doc(db, 'pricing', id))
            fetchPricing()
        } catch (error) {
            alert('Error deleting pricing')
        }
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="text-muted">Manage your portfolio content</p>
                </div>
                <button onClick={handleLogout} className="btn btn-outline danger-hover">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <nav className="admin-tabs">
                <button
                    className={activeTab === 'projects' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('projects')}
                >
                    <Briefcase size={18} /> Projects
                </button>
                <button
                    className={activeTab === 'pricing' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('pricing')}
                >
                    <Package size={18} /> Pricing
                </button>
                <button
                    className={activeTab === 'skills' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('skills')}
                >
                    <GraduationCap size={18} /> Skills
                </button>
            </nav>

            <main className="admin-content">
                {activeTab === 'projects' && (
                    <div className="card glass">
                        <h2 className="card-title">Add New Project</h2>
                        <form onSubmit={handleProjectSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Project Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Cool Project Name" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows="4" required placeholder="Describe the project..." />
                            </div>
                            <div className="form-group">
                                <label>Tech Stack (comma separated)</label>
                                <input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="React, Node.js, Firebase" required />
                            </div>
                            <div className="form-group">
                                <label>Live Link (Optional)</label>
                                <input value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." />
                            </div>
                            <div className="form-group">
                                <label>Thumbnail Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="file-input" />
                            </div>
                            <div className="form-group">
                                <label>Project PDF (Info/Brochure)</label>
                                <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} className="file-input" />
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                                {uploading ? 'Pushing to cloud...' : 'Publish Project'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="admin-grid">
                        <div className="card glass">
                            <h2 className="card-title">Add Pricing Plan</h2>
                            <div className="form-group">
                                <label>Plan Title</label>
                                <input
                                    type="text"
                                    value={newPlan.title}
                                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                                    placeholder="Starter"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="text"
                                    value={newPlan.price}
                                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                    placeholder="$999"
                                />
                            </div>
                            <div className="form-group">
                                <label>Features (comma separated)</label>
                                <textarea
                                    value={newPlan.features}
                                    onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                                    placeholder="Feature 1, Feature 2..."
                                    rows="3"
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <input
                                    type="checkbox"
                                    id="recommended"
                                    checked={newPlan.recommended}
                                    onChange={(e) => setNewPlan({ ...newPlan, recommended: e.target.checked })}
                                />
                                <label htmlFor="recommended">Best Value / Recommended</label>
                            </div>
                            <button className="btn btn-primary w-full" onClick={handleAddPricing}>
                                <Plus size={18} /> Add Plan
                            </button>
                        </div>

                        <div className="card glass">
                            <h2 className="card-title">Existing Plans</h2>
                            <div className="list-container">
                                {plans.map(plan => (
                                    <div key={plan.id} className="list-item">
                                        <div>
                                            <strong>{plan.title}</strong> - {plan.price}
                                            {plan.recommended && <span className="small-badge">Recommended</span>}
                                        </div>
                                        <button className="btn-icon danger" onClick={() => handleDeletePricing(plan.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {plans.length === 0 && <p className="text-muted">No plans added yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="admin-grid">
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
                                    className="range-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Color</label>
                                <input
                                    type="color"
                                    value={newSkill.color}
                                    onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                                    className="color-input"
                                />
                            </div>
                            <button className="btn btn-primary w-full" onClick={handleAddSkill}>
                                <Plus size={18} /> Add Skill
                            </button>
                        </div>

                        <div className="card glass">
                            <h2 className="card-title">Manage Skills</h2>
                            <div className="list-container">
                                {skills.map(skill => (
                                    <div key={skill.id} className="list-item">
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
                )}
            </main>
        </div>
    )
}

export default Admin
