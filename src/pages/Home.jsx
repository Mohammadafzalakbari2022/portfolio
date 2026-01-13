import './Home.css'

function Home() {
    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Full Stack <br />
                        <span className="hero-highlight">Developer.</span>
                    </h1>
                    <p className="hero-subtitle">
                        I build premium web and mobile experiences.
                        Specializing in React, Node.js, and high-performance applications.
                    </p>
                    <div className="hero-actions">
                        <a href="/projects" className="btn btn-primary">View Work</a>
                        <a href="/contact" className="btn btn-secondary">Contact Me</a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
