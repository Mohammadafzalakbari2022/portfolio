import { Link, Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
    return (
        <div className="layout-container">
            <nav className="navbar">
                <Link to="/" className="logo">MOH.AKBARI</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </nav>

            <main className="content">
                <Outlet />
            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Moh.Akbari. All rights reserved.</p>
                <div className="social-links">
                    {/* Add social icons here later */}
                </div>
            </footer>
        </div>
    )
}

export default Layout
