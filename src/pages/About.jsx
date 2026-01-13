import './About.css'

function About() {
    const skills = [
        { title: "Frontend", items: ["React", "Vite", "Tailwind/Vanilla CSS", "Next.js"] },
        { title: "Backend", items: ["Node.js", "Express", "Firebase", "PostgreSQL"] },
        { title: "Tools", items: ["Git", "Docker", "Figma", "VS Code"] }
    ];

    const workflow = [
        { step: "01", title: "Discovery", desc: "Understanding your detailed requirements and business goals." },
        { step: "02", title: "Design", desc: "Creating high-fidelity wireframes and premium UI concepts." },
        { step: "03", title: "Build", desc: "Developing the application with clean, scalable code." },
        { step: "04", title: "Launch", desc: "Deploying, testing, and optimizing for performance." }
    ];

    return (
        <div className="about-page">
            <section className="about-hero">
                <h1>More Than Just Code.</h1>
                <p className="about-sub">
                    I am a passionate Full Stack Developer dedicated to building digital products that look great and perform perfectly.
                </p>
            </section>

            <section className="skills-section">
                <h2>My Arsenal</h2>
                <div className="skills-grid">
                    {skills.map((skill, index) => (
                        <div key={index} className="skill-card">
                            <h3>{skill.title}</h3>
                            <ul>
                                {skill.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="workflow-section">
                <h2>How I Work</h2>
                <div className="workflow-grid">
                    {workflow.map((item, index) => (
                        <div key={index} className="workflow-card">
                            <span className="step-number">{item.step}</span>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default About
