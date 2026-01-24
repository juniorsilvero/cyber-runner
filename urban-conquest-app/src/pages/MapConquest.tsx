import { Lock, Star, Play, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { WorldSelect } from "./WorldSelect";

// Mock Data for "World 1" with Beginner Curve and Rewards
const levels = [
    { id: 1, km: 1.0, title: "First Steps", rewards: [5, 4, 3], status: "current", locked: false, description: "A short warmup run." },
    { id: 2, km: 1.5, title: "Neon Warmup", rewards: [5, 4, 3], status: "locked", locked: true, description: "Picking up the pace." },
    { id: 3, km: 2.0, title: "Street Pulse", rewards: [10, 8, 6], status: "locked", locked: true, description: "Feel the rhythm of the city." },
    { id: 4, km: 3.0, title: "Cyber Sprint", rewards: [15, 12, 10], status: "locked", locked: true, description: "Push further." },
    { id: 5, km: 4.0, title: "Block Run", rewards: [20, 15, 12], status: "locked", locked: true, description: "Building endurance." },
    { id: 6, km: 5.0, title: "Sector 7 Dash", rewards: [25, 20, 15], status: "locked", locked: true, description: "5K Milestone!" },
    { id: 7, km: 6.5, title: "The Long Run", rewards: [30, 25, 20], status: "locked", locked: true, description: "Testing limits." },
    { id: 8, km: 8.0, title: "City Limit", rewards: [40, 30, 25], status: "locked", locked: true, description: "Almost there." },
    { id: 9, km: 10.0, title: "Elite Zone", rewards: [50, 40, 30], status: "locked", locked: true, description: "10K Challenge." },
    { id: 10, km: 12.0, title: "Citadel Boss", rewards: [100, 80, 50], status: "locked", locked: true, isBoss: true, description: "The final conquest." },
];

export function MapConquest() {
    const [view, setView] = useState<'worlds' | 'levels'>('worlds');
    const [selectedLevel, setSelectedLevel] = useState<any>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current level on mount
    useEffect(() => {
        if (view === 'levels' && scrollContainerRef.current) {
            // Find current level element or default to START (left)
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [view]);

    if (view === 'worlds') {
        return <WorldSelect onSelectWorld={(id) => {
            if (id === 1) setView('levels');
            else alert("This world is currently locked.");
        }} />;
    }

    return (
        <div className="flex flex-col h-full bg-cyber-black relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-deep-petrol/40 via-cyber-black to-cyber-black pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 px-6 pt-6 flex justify-between items-center bg-cyber-black/80 backdrop-blur-md pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('worlds')} className="bg-surface-dark p-2 rounded-full border border-white/10 hover:border-white text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-display font-bold text-xl text-white tracking-wider uppercase">WORLD 1</h2>
                        <p className="text-[10px] text-neon-yellow font-bold uppercase tracking-widest">Neon Outskirts</p>
                    </div>
                </div>
                <div className="bg-surface-dark px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <Star size={14} className="text-neon-yellow fill-neon-yellow" />
                    <span className="text-xs font-bold text-white">0/30</span>
                </div>
            </div>

            {/* Path / Scrollable Area */}
            <div
                ref={scrollContainerRef}
                className="flex-1 w-full overflow-x-auto overflow-y-hidden no-scrollbar relative z-10 scroll-smooth h-full"
            >
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427306-6354db696beb?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-30 pointer-events-none grayscale mix-blend-overlay fixed" />

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
                                        {level.title}
                                    </div>

                                    {/* Current Indicator */}
                                    {level.status === 'current' && (
                                        <div className="absolute -top-12 bg-white text-deep-petrol text-xs font-bold px-3 py-1.5 rounded-xl animate-bounce shadow-lg z-30">
                                            START
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
                    <>
                        {/* Overlay - Simplified for speed */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 z-50 bg-black/70 pb-28 px-4"
                            onClick={() => setSelectedLevel(null)}
                        />

                        {/* Modal content */}
                        <motion.div
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 500 }}
                            dragElastic={0.05} // Reduced elasticity to prevent "flutter"
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 60 || info.velocity.y > 400) {
                                    setSelectedLevel(null);
                                }
                            }}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 40,
                                stiffness: 400,
                                mass: 0.6
                            }}
                            className="absolute bottom-28 left-4 right-4 z-[51] bg-surface-dark border border-white/10 rounded-3xl p-6 pb-8 shadow-2xl h-auto overflow-hidden touch-none will-change-transform max-w-md mx-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Drag handle */}
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

                            <div className="text-center">
                                <span className="text-neon-yellow font-bold tracking-[0.2em] text-[10px] uppercase mb-1 block">LEVEL {selectedLevel.id}</span>
                                <h3 className="font-display font-bold text-2xl text-white mb-1 uppercase tracking-tight">{selectedLevel.title}</h3>
                                <p className="text-tech-grey text-xs mb-4 px-4 leading-relaxed">{selectedLevel.description}</p>

                                <div className="flex justify-center mb-5">
                                    <div className="bg-black/30 px-4 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[100px]">
                                        <span className="text-tech-grey text-[9px] font-bold uppercase mb-0.5">DISTANCE</span>
                                        <span className="text-white font-display font-bold text-xl">{selectedLevel.km} <span className="text-xs">KM</span></span>
                                    </div>
                                </div>

                                {/* Rewards Box */}
                                <div className="bg-deep-petrol/20 rounded-xl p-4 border border-white/5 mb-6 max-w-sm mx-auto">
                                    <p className="text-[10px] font-bold text-white/50 mb-3 uppercase tracking-widest text-center">Rewards & Goals</p>
                                    <div className="grid grid-cols-3 gap-1 text-center">
                                        <div className="flex flex-col items-center space-y-1">
                                            <Star size={14} className="text-neon-yellow fill-neon-yellow" />
                                            <span className="text-white font-bold text-base">{selectedLevel.rewards[0]}</span>
                                            <span className="text-[9px] text-tech-grey leading-tight">&lt;7:00<br />km</span>
                                        </div>
                                        <div className="flex flex-col items-center space-y-1 opacity-80 border-x border-white/5">
                                            <Star size={14} className="text-neon-yellow/70 fill-neon-yellow/70" />
                                            <span className="text-white font-bold text-lg">{selectedLevel.rewards[1]}</span>
                                            <span className="text-[9px] text-tech-grey leading-tight">7-9:00<br />km</span>
                                        </div>
                                        <div className="flex flex-col items-center space-y-1 opacity-60">
                                            <Star size={14} className="text-neon-yellow/40 fill-neon-yellow/40" />
                                            <span className="text-white font-bold text-lg">{selectedLevel.rewards[2]}</span>
                                            <span className="text-[9px] text-tech-grey leading-tight">&gt;9:00<br />km</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-neon-yellow text-deep-petrol font-display font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(230,255,43,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mb-2">
                                <Play fill="currentColor" size={20} />
                                <span>START RUN</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
