import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function SkillCircle({ percentage, name, color = "var(--accent-primary)" }) {
    const [progress, setProgress] = useState(0)

    // Circle config
    const radius = 40
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
        // Animate progress slightly after mount for effect
        const timer = setTimeout(() => setProgress(percentage), 200)
        return () => clearTimeout(timer)
    }, [percentage])

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="var(--border-color)"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold font-heading tabular-nums">
                        {progress}%
                    </span>
                </div>
            </div>
            <span className="text-lg font-medium text-secondary">{name}</span>
        </div>
    )
}
