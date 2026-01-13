import './Contact.css'

function Contact() {
    return (
        <div className="contact-container">
            <div className="contact-content">
                <h1>Let's work together.</h1>
                <p>Tell me about your project and I will get back to you within 24 hours.</p>

                <form className="contact-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="John Doe" required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="john@example.com" required />
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows="5" placeholder="Project details..." required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">Send Message</button>
                </form>

                <div className="contact-info">
                    <p>Email: contact@mohakbari.com</p>
                    <p>Location: Remote / Dubai, UAE</p>
                </div>
            </div>
        </div>
    )
}

export default Contact
