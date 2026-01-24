import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface CircularProgressProps {
    value: number; // 0 to 100
    title: string;
    subtitle: string;
    size?: number;
    className?: string;
}

export function CircularProgress({ value, title, subtitle, size = 220, className }: CircularProgressProps) {
    const radius = size * 0.35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-neon-yellow/5 rounded-full blur-2xl" />

            {/* Background Circle */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/10"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-neon-yellow drop-shadow-[0_0_10px_rgba(230,255,43,0.5)]"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>

            {/* Central Text */}
            <div className="absolute text-center flex flex-col items-center">
                <h2 className="text-4xl font-display font-bold text-white tracking-widest leading-none">
                    {title}
                </h2>
                <span className="text-xs font-bold text-tech-grey tracking-[0.2em] mt-2 uppercase">
                    {subtitle}
                </span>
            </div>
        </div>
    );
}
