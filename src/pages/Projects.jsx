import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import './Projects.css'

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const projectList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProjects(projectList);
            } catch (error) {
                console.error("Error fetching projects: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="loading">Loading Projects...</div>

    return (
        <div className="projects-container">
            <h1 className="page-title">Selected Works</h1>

            {projects.length === 0 ? (
                <div className="no-projects">
                    <p>No projects uploaded yet.</p>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            {project.thumbnailUrl && <img src={project.thumbnailUrl} alt={project.title} className="project-thumb" />}
                            <div className="project-info">
                                <h2>{project.title}</h2>
                                <p>{project.description}</p>

                                <div className="tech-stack">
                                    {project.techStack?.map((tech, i) => (
                                        <span key={i} className="tech-tag">{tech}</span>
                                    ))}
                                </div>

                                <div className="project-links">
                                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn-sm">Live Demo</a>}
                                    {project.pdfUrl && <a href={project.pdfUrl} target="_blank" rel="noreferrer" className="btn-sm btn-outline">View PDF</a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Projects
