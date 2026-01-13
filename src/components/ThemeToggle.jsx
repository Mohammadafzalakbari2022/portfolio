import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useEffect, useState } from "react"
import "./ThemeToggle.css"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="theme-toggle glass">
            <button
                onClick={() => setTheme("light")}
                className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
                aria-label="Light Mode"
            >
                <Sun size={18} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`toggle-btn ${theme === 'system' ? 'active' : ''}`}
                aria-label="System Mode"
            >
                <Monitor size={18} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                aria-label="Dark Mode"
            >
                <Moon size={18} />
            </button>
        </div>
    )
}
