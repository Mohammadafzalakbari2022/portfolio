import { Link, Outlet, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { motion } from 'framer-motion'
import './Layout.css'

function Layout() {
    const location = useLocation()
    const currentPath = location.pathname

    const links = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/projects', label: 'Projects' },
        { path: '/pricing', label: 'Pricing' },
        { path: '/contact', label: 'Contact' },
    ]

    return (
        <div className="layout-container">
            <nav className="navbar glass">
                <Link to="/" className="logo">MOH.AKBARI</Link>
                <div className="nav-right">
                    <div className="nav-links">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${currentPath === link.path ? 'active' : ''}`}
                            >
                                {currentPath === link.path && (
                                    <motion.span
                                        layoutId="nav-pill"
                                        className="nav-pill"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="nav-link-text">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <ThemeToggle />
            </nav>

            <main className="content">
                <Outlet />
            </main>

            <footer className="footer">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <p>&copy; {new Date().getFullYear()} Moh.Akbari. All rights reserved.</p>
                    <Link to="/login" style={{ fontSize: '0.8rem', opacity: 0.5, textDecoration: 'none', color: 'inherit' }}>Admin</Link>
                </div>
            </footer>
        </div>
    )
}

export default Layout
