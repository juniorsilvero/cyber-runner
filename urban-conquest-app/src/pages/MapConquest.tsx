import { Lock, Star, Play, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { WorldSelect } from "./WorldSelect";
import { useTranslation } from 'react-i18next';
import { RunningSession } from './RunningSession';

// Mock Data for "World 1" with Beginner Curve and Rewards
const levels = [
    { id: 1, km: 1.0, rewards: [5, 4, 3], status: "current", locked: false },
    { id: 2, km: 1.5, rewards: [5, 4, 3], status: "locked", locked: true },
    { id: 3, km: 2.0, rewards: [10, 8, 6], status: "locked", locked: true },
    { id: 4, km: 3.0, rewards: [15, 12, 10], status: "locked", locked: true },
    { id: 5, km: 4.0, rewards: [20, 15, 12], status: "locked", locked: true },
    { id: 6, km: 5.0, rewards: [25, 20, 15], status: "locked", locked: true },
    { id: 7, km: 6.5, rewards: [30, 25, 20], status: "locked", locked: true },
    { id: 8, km: 8.0, rewards: [40, 30, 25], status: "locked", locked: true },
    { id: 9, km: 10.0, rewards: [50, 40, 30], status: "locked", locked: true },
    { id: 10, km: 12.0, rewards: [100, 80, 50], status: "locked", locked: true, isBoss: true },
];

// World background configurations
const worldBackgrounds = {
    1: { // Neon Outskirts
        gradient: "from-cyan-900/40 via-teal-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent",
        scanlines: true
    },
    2: { // Industrial Sector
        gradient: "from-amber-900/40 via-orange-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600/15 via-transparent to-transparent",
        scanlines: false
    },
    3: { // Cyber Downtown
        gradient: "from-purple-900/40 via-fuchsia-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/15 via-transparent to-transparent",
        scanlines: true
    },
    4: { // Skyline Bridge
        gradient: "from-blue-900/40 via-sky-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent",
        scanlines: false
    },
    5: { // Data Center
        gradient: "from-emerald-900/40 via-green-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/12 via-transparent to-transparent",
        scanlines: true
    },
    6: { // The Void
        gradient: "from-gray-900/40 via-slate-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent",
        scanlines: false
    },
    7: { // Solar Array
        gradient: "from-orange-800/40 via-yellow-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/15 via-transparent to-transparent",
        scanlines: false
    },
    8: { // Toxic Wasteland
        gradient: "from-green-900/40 via-lime-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-500/12 via-transparent to-transparent",
        scanlines: true
    },
    9: { // Crystal Peaks
        gradient: "from-cyan-900/40 via-blue-900/30 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-400/15 via-transparent to-transparent",
        scanlines: false
    },
    10: { // Citadel Core
        gradient: "from-red-950/50 via-red-900/40 to-cyber-black",
        overlay: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent",
        scanlines: true
    }
};

interface ActivityData {
    id: string;
    type: 'corrida' | 'caminhada' | 'sprint';
    route: [number, number][];
    distance: number;
    duration: number;
    pace: string;
    rcEarned: number;
    timestamp: number;
    name?: string;
}

export function MapConquest() {
    const { t } = useTranslation();
    const [view, setView] = useState<'worlds' | 'levels'>('worlds');
    const [selectedWorld, setSelectedWorld] = useState<number>(1);
    const [selectedLevel, setSelectedLevel] = useState<any>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showRunningSession, setShowRunningSession] = useState(false);

    // Handle activity finish
    const handleFinishActivity = (activity: ActivityData) => {
        // Save to localStorage
        const stored = localStorage.getItem('activities');
        const activities = stored ? JSON.parse(stored) : [];
        activities.unshift(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
        setShowRunningSession(false);
        setSelectedLevel(null);
    };

    // Auto-scroll to current level on mount
    useEffect(() => {
        if (view === 'levels' && scrollContainerRef.current) {
            // Find current level element or default to START (left)
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [view]);

    // Show running session if active
    if (showRunningSession) {
        return (
            <RunningSession
                onFinish={handleFinishActivity}
                onCancel={() => setShowRunningSession(false)}
            />
        );
    }

    if (view === 'worlds') {
        return <WorldSelect onSelectWorld={(id) => {
            setSelectedWorld(id);
            if (id === 1) setView('levels');
            else alert("This world is currently locked.");
        }} />;
    }

    const bgConfig = worldBackgrounds[selectedWorld as keyof typeof worldBackgrounds] || worldBackgrounds[1];

    return (
        <div className="flex flex-col h-full bg-cyber-black relative overflow-hidden">
            {/* Dynamic World Background */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-b pointer-events-none transition-all duration-1000",
                bgConfig.gradient
            )} />

            {/* Overlay Effect */}
            <div className={cn(
                "absolute inset-0 pointer-events-none transition-all duration-1000",
                bgConfig.overlay
            )} />

            {/* Scanlines Effect (for certain worlds) */}
            {bgConfig.scanlines && (
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)] animate-scan" />
                </div>
            )}

            {/* Header */}
            <div className="relative z-10 px-6 pt-6 flex justify-between items-center bg-cyber-black/80 backdrop-blur-md pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('worlds')} className="bg-surface-dark p-2 rounded-full border border-white/10 hover:border-white text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-display font-bold text-xl text-white tracking-wider uppercase">
                            {t('map_page.select_world').replace('SELECIONAR', '')} {selectedWorld}
                        </h2>
                        <p className="text-[10px] text-tech-grey uppercase font-bold tracking-wider">
                            {t(`map_page.worlds.${selectedWorld}.name`)}
                        </p>
                    </div>
                </div>

                {/* Star Counter */}
                <div className="flex items-center gap-2 bg-neon-yellow/10 px-3 py-1.5 rounded-full border border-neon-yellow/30">
                    <Star size={14} className="text-neon-yellow fill-neon-yellow" />
                    <span className="text-neon-yellow font-black text-sm">0/40</span>
                </div>
            </div>

            {/* Path / Scrollable Area */}
            <div
                ref={scrollContainerRef}
                className="flex-1 w-full overflow-x-auto overflow-y-hidden no-scrollbar relative z-10 scroll-smooth h-full"
            >
                {/* The Path Container */}
                <div className="flex flex-row items-center h-full min-h-full space-x-24 pl-[calc(50vw-2.5rem)] pr-[calc(50vw-2.5rem)] min-w-max">
                    {levels.map((level, index) => {
                        const isUp = index % 2 === 0;
                        const isBoss = level.isBoss;

                        return (
                            <div key={level.id} className="relative flex flex-col items-center justify-center">
                                {/* Connector Line (SVG for better curves) */}
                                {index < levels.length - 1 && (
                                    <svg className="absolute left-1/2 h-40 w-44 pointer-events-none -z-10 overflow-visible"
                                        style={{
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d={isUp
                                                ? "M 0 20 C 25 20, 75 80, 100 80"
                                                : "M 0 80 C 25 80, 75 20, 100 20"
                                            }
                                            fill="none"
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth="3"
                                            strokeDasharray="6 6"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                )}

                                <button
                                    onClick={() => setSelectedLevel(level)}
                                    disabled={level.locked}
                                    className={cn(
                                        "relative flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group",
                                        isBoss ? "w-24 h-24" : "w-20 h-20",
                                        level.status === 'current' ? "animate-pulse-slow scale-110" : "",
                                        isUp ? "-translate-y-12" : "translate-y-12"
                                    )}
                                >
                                    {/* Level Circle */}
                                    <div className={cn(
                                        "absolute inset-0 rounded-full border-4 flex items-center justify-center shadow-lg transition-colors z-20",
                                        level.status === 'completed' ? "bg-neon-yellow border-neon-yellow" :
                                            level.status === 'current' ? "bg-deep-petrol border-neon-yellow shadow-[0_0_30px_rgba(230,255,43,0.6)]" :
                                                "bg-surface-dark border-white/20"
                                    )}>
                                        {level.locked ? (
                                            <Lock size={isBoss ? 24 : 16} className="text-white/20" />
                                        ) : level.status === 'completed' ? (
                                            <Star size={isBoss ? 32 : 24} className="text-deep-petrol fill-deep-petrol" />
                                        ) : (
                                            <span className="font-display font-bold text-white text-xl">{level.id}</span>
                                        )}
                                    </div>

                                    {/* Level Title Label (floating) */}
                                    <div className={cn(
                                        "absolute -bottom-8 whitespace-nowrap px-3 py-1 rounded bg-black/80 text-[10px] font-bold text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 border border-white/10",
                                        level.locked && "hidden"
                                    )}>
                                        {t(`map_page.levels.${level.id}.title`)}
                                    </div>

                                    {/* Current Indicator */}
                                    {level.status === 'current' && (
                                        <div className="absolute -top-12 bg-white text-deep-petrol text-xs font-bold px-3 py-1.5 rounded-xl animate-bounce shadow-lg z-30">
                                            {t('map_page.start')}
                                            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Level Info Modal / Drawer */}
            <AnimatePresence>
                {selectedLevel && (
                    <div className="fixed inset-0 z-[2000] flex items-end justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={() => setSelectedLevel(null)} />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 100) {
                                    setSelectedLevel(null);
                                }
                            }}
                            className="bg-surface-dark border-t border-x border-border-grey w-full max-w-lg rounded-t-[2.5rem] p-6 pb-10 shadow-2xl relative pointer-events-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing" />
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-neon-yellow/10 px-4 py-1.5 rounded-full border border-neon-yellow/20 mb-3">
                                    <span className="text-neon-yellow font-black text-[9px] tracking-[0.2em] uppercase">
                                        {t('map_page.level_label')} {selectedLevel.id}
                                    </span>
                                </div>
                                <h3 className="font-display font-black text-3xl text-white uppercase tracking-tighter mb-1 leading-none">
                                    {t(`map_page.levels.${selectedLevel.id}.title`)}
                                </h3>
                                <p className="text-white/40 text-xs mb-5 px-4 leading-relaxed font-bold">
                                    {t(`map_page.levels.${selectedLevel.id}.description`)}
                                </p>

                                <div className="grid grid-cols-1 w-full gap-4 mb-5">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-white">
                                        <span className="opacity-40 font-black text-[9px] uppercase block mb-1">
                                            {t('map_page.distance')}
                                        </span>
                                        <span className="font-black text-2xl tracking-tighter block">
                                            {selectedLevel.km} {t('map_page.km')}
                                        </span>
                                    </div>
                                </div>

                                {/* Rewards Box */}
                                <div className="w-full bg-gradient-to-br from-neon-yellow/10 to-neon-yellow/5 rounded-3xl p-5 border-2 border-neon-yellow/30 mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Star size={14} className="text-neon-yellow fill-neon-yellow" />
                                        <p className="text-white font-black text-xs tracking-wider uppercase">
                                            Como Ganhar Estrelas
                                        </p>
                                        <Star size={14} className="text-neon-yellow fill-neon-yellow" />
                                    </div>
                                    <p className="text-white/60 text-[10px] text-center mb-4 leading-relaxed font-bold">
                                        Quanto mais rápido você correr, mais estrelas ganha!
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-black/40 rounded-xl p-3 border border-neon-yellow/40">
                                            <div className="flex justify-center mb-2">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={12} className="text-neon-yellow fill-neon-yellow -mx-0.5" />
                                                ))}
                                            </div>
                                            <span className="text-neon-yellow font-black text-2xl block mb-1">{selectedLevel.rewards[0]}</span>
                                            <span className="text-[10px] text-white font-black uppercase block mb-1">Estrelas</span>
                                            <div className="bg-neon-yellow/20 rounded px-2 py-1 mt-2">
                                                <span className="text-[11px] text-white font-black">&lt;7:00/km</span>
                                            </div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-3 border border-white/20">
                                            <div className="flex justify-center mb-2">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <Star key={i} size={12} className="text-neon-yellow/80 fill-neon-yellow/80 -mx-0.5" />
                                                ))}
                                            </div>
                                            <span className="text-white font-black text-2xl block mb-1">{selectedLevel.rewards[1]}</span>
                                            <span className="text-[10px] text-white/60 font-black uppercase block mb-1">Estrelas</span>
                                            <div className="bg-white/10 rounded px-2 py-1 mt-2">
                                                <span className="text-[11px] text-white/80 font-black">7-9:00/km</span>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                                            <div className="flex justify-center mb-2">
                                                {[1, 2, 3].map((i) => (
                                                    <Star key={i} size={12} className="text-neon-yellow/50 fill-neon-yellow/50 -mx-0.5" />
                                                ))}
                                            </div>
                                            <span className="text-white/80 font-black text-2xl block mb-1">{selectedLevel.rewards[2]}</span>
                                            <span className="text-[10px] text-white/40 font-black uppercase block mb-1">Estrelas</span>
                                            <div className="bg-white/5 rounded px-2 py-1 mt-2">
                                                <span className="text-[11px] text-white/60 font-black">&gt;9:00/km</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowRunningSession(true)}
                                    className="w-full bg-neon-yellow text-deep-petrol font-display font-black text-2xl py-6 rounded-3xl shadow-2xl transition-all flex items-center justify-center gap-4 uppercase tracking-widest hover:scale-[1.02] active:scale-95"
                                >
                                    <Play fill="currentColor" size={28} />
                                    <span>{t('map_page.start_run')}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
