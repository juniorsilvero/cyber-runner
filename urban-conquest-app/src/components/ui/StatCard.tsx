import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
    icon: LucideIcon;
    value: string;
    label: string;
    className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
    return (
        <div className={cn("bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col items-start min-w-[140px]", className)}>
            <div className="bg-neon-yellow/10 p-2 rounded-lg mb-3">
                <Icon className="text-neon-yellow" size={20} />
            </div>
            <span className="text-3xl font-display font-bold text-white tracking-wide">{value}</span>
            <span className="text-[10px] font-bold text-tech-grey uppercase tracking-wider mt-1">{label}</span>
        </div>
    );
}
