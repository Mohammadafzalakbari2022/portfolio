import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

import Login from './pages/Login'
import Admin from './pages/Admin'

import About from './pages/About'
import Projects from './pages/Projects'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'

// Placeholders for other pages for now
const Placeholder = ({ title }) => (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h1>{title}</h1>
        <p>Coming Soon</p>
    </div>
)

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
