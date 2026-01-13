import { Link } from 'react-router-dom'
import { ArrowRight, Code, Code2, Globe } from 'lucide-react'
import './Home.css'

function Home() {
    return (
        <div className="home-container">
            <div className="hero-bg-glow" />

            <div className="hero-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent-primary)' }}>
                    <Code2 size={24} />
                    <span style={{ fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.9rem' }}>FULL STACK DEVELOPER</span>
                </div>

                <h1 className="hero-title">
                    Building <span className="highlight">Digital Experiences</span> That Matter
                </h1>

                <p className="hero-subtitle">
                    I craft high-performance, accessible, and beautiful web applications using modern technologies.
                </p>

                <div className="cta-group">
                    <Link to="/projects" className="btn btn-primary">
                        View Projects
                    </Link>
                    <Link to="/contact" className="btn btn-secondary">
                        Contact Me
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
