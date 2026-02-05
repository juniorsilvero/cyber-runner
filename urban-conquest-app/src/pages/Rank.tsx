import * as React from "react";
import {
    Trophy,
    MapPin,
    Map as MapIcon,
    ChevronRight,
    Crown,
    Loader2,
    Navigation,
    X,
    Play,
    Filter
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { RunningSession } from './RunningSession';
import {
    getDistanceRoutes,
    generateLeaderboard,
    getCityFromCoords,
    getStateRanking,
    BRAZILIAN_STATES,
    type DistanceRoute,
    type DistanceKm,
    type LeaderboardEntry,
    type StateRanking
} from "../data/leaderboard";

interface RankProps {
    onStartRun?: (km: number, city: string) => void;
}

export function Rank({ onStartRun }: RankProps) {
    const [view, setView] = React.useState<'ranqueada' | 'ranking'>('ranqueada');

    // GPS and location state
    const [gpsStatus, setGpsStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
    const [currentCity, setCurrentCity] = React.useState<string>('');
    const [currentState, setCurrentState] = React.useState<string>('');
    const [currentStateCode, setCurrentStateCode] = React.useState<string>('');

    // Distance routes
    const [distanceRoutes, setDistanceRoutes] = React.useState<DistanceRoute[]>([]);

    // Modal state
    const [selectedDistance, setSelectedDistance] = React.useState<DistanceKm | null>(null);
    const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);

    // Ranking state (for Ranking tab)
    const [selectedStateFilter, setSelectedStateFilter] = React.useState<string>('SP');
    const [stateRanking, setStateRanking] = React.useState<StateRanking[]>([]);

    // Running session state
    const [showRunningSession, setShowRunningSession] = React.useState(false);

    // Get user location on mount
    React.useEffect(() => {
        if (!navigator.geolocation) {
            setGpsStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const location = await getCityFromCoords(latitude, longitude);

                if (location) {
                    setCurrentCity(location.city);
                    setCurrentState(location.state);
                    setCurrentStateCode(location.stateCode);
                    setDistanceRoutes(getDistanceRoutes(location.city));
                    setGpsStatus('success');
                } else {
                    // Fallback to São Paulo
                    setCurrentCity('São Paulo');
                    setCurrentState('São Paulo');
                    setCurrentStateCode('SP');
                    setDistanceRoutes(getDistanceRoutes('São Paulo'));
                    setGpsStatus('success');
                }
            },
            (error) => {
                console.error('GPS error:', error);
                // Fallback
                setCurrentCity('São Paulo');
                setCurrentState('São Paulo');
                setCurrentStateCode('SP');
                setDistanceRoutes(getDistanceRoutes('São Paulo'));
                setGpsStatus('success');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    // Load leaderboard when distance is selected
    React.useEffect(() => {
        if (selectedDistance && currentCity) {
            setLeaderboard(generateLeaderboard(currentCity, selectedDistance));
        }
    }, [selectedDistance, currentCity]);

    // Load state ranking when filter changes
    React.useEffect(() => {
        if (view === 'ranking') {
            setStateRanking(getStateRanking(selectedStateFilter));
        }
    }, [view, selectedStateFilter]);

    // Handle start run
    const handleStartRun = (km: DistanceKm) => {
        if (onStartRun) {
            onStartRun(km, currentCity);
        } else {
            setShowRunningSession(true);
        }
    };

    // Handle activity finish
    const handleFinishActivity = (activity: any) => {
        const stored = localStorage.getItem('activities');
        const activities = stored ? JSON.parse(stored) : [];
        activities.unshift(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
        setShowRunningSession(false);
    };

    // Show running session if active
    if (showRunningSession) {
        return (
            <RunningSession
                onFinish={handleFinishActivity}
                onCancel={() => setShowRunningSession(false)}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-cyber-black overflow-hidden relative font-body antialiased">
            {/* Header with Tabs */}
            <div className="absolute top-0 left-0 right-0 z-[100] p-6">
                <div className="flex bg-surface-dark/90 backdrop-blur-xl p-1.5 rounded-2xl border border-border-grey shadow-2xl">
                    <button
                        onClick={() => setView('ranqueada')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                            view === 'ranqueada'
                                ? "bg-neon-yellow text-deep-petrol shadow-lg"
                                : "text-tech-grey hover:text-white"
                        )}
                    >
                        <MapIcon size={18} strokeWidth={2.5} />
                        <span className="font-display font-black text-[11px] uppercase tracking-widest">Ranqueada</span>
                    </button>
                    <button
                        onClick={() => setView('ranking')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                            view === 'ranking'
                                ? "bg-neon-yellow text-deep-petrol shadow-lg"
                                : "text-tech-grey hover:text-white"
                        )}
                    >
                        <Trophy size={18} strokeWidth={2.5} />
                        <span className="font-display font-black text-[11px] uppercase tracking-widest">Ranking</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pt-24 pb-24 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {view === 'ranqueada' ? (
                        <motion.div
                            key="ranqueada-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="px-6"
                        >
                            {/* GPS Status */}
                            {gpsStatus === 'loading' && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-yellow/20 to-cyan-500/20 animate-pulse" />
                                        <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-neon-yellow animate-spin" />
                                    </div>
                                    <p className="mt-6 text-white font-display font-bold text-lg">Localizando...</p>
                                    <p className="text-tech-grey text-sm">Buscando sua posição via GPS</p>
                                </div>
                            )}

                            {gpsStatus === 'success' && (
                                <>
                                    {/* City Header */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-8"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Navigation size={14} className="text-neon-yellow" />
                                            <span className="text-tech-grey text-xs font-bold uppercase tracking-wider">Sua localização</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-surface-dark to-surface-dark/50 p-5 rounded-2xl border border-border-grey relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neon-yellow/10 to-transparent rounded-bl-full" />
                                            <div className="relative z-10">
                                                <h1 className="text-3xl font-display font-black text-white mb-1">{currentCity}</h1>
                                                <p className="text-tech-grey text-sm">{currentState} • {currentStateCode}</p>
                                            </div>
                                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-neon-yellow/20" />
                                        </div>
                                    </motion.div>

                                    {/* Distance Routes */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h2 className="text-white font-display font-bold text-lg mb-4">Escolha uma Distância</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {distanceRoutes.map((route, index) => (
                                                <motion.button
                                                    key={route.km}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    onClick={() => setSelectedDistance(route.km)}
                                                    className="group relative bg-surface-dark/80 backdrop-blur rounded-2xl border border-border-grey overflow-hidden hover:border-neon-yellow/50 transition-all duration-300"
                                                >
                                                    {/* Gradient accent */}
                                                    <div className={cn(
                                                        "absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b",
                                                        route.gradient
                                                    )} />

                                                    <div className="flex items-center p-4 pl-5">
                                                        {/* Icon + KM */}
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div className={cn(
                                                                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg",
                                                                route.gradient
                                                            )}>
                                                                {route.icon}
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-3xl font-display font-black text-white">{route.km}</span>
                                                                    <span className="text-lg font-bold text-tech-grey">KM</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className={cn(
                                                                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                                                                        route.difficulty === 'easy' && "bg-green-500/20 text-green-400",
                                                                        route.difficulty === 'medium' && "bg-blue-500/20 text-blue-400",
                                                                        route.difficulty === 'hard' && "bg-orange-500/20 text-orange-400",
                                                                        route.difficulty === 'extreme' && "bg-red-500/20 text-red-400"
                                                                    )}>
                                                                        {route.difficulty === 'easy' && 'Fácil'}
                                                                        {route.difficulty === 'medium' && 'Médio'}
                                                                        {route.difficulty === 'hard' && 'Difícil'}
                                                                        {route.difficulty === 'extreme' && 'Extremo'}
                                                                    </span>
                                                                    <span className="text-tech-grey text-xs">~{route.estimatedTime}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Top 1 */}
                                                        <div className="flex items-center gap-3">
                                                            {route.top1 && (
                                                                <div className="text-right">
                                                                    <div className="flex items-center gap-1 justify-end">
                                                                        <Crown size={12} className="text-yellow-400" />
                                                                        <span className="text-xs font-bold text-yellow-400">TOP 1</span>
                                                                    </div>
                                                                    <p className="text-white text-sm font-bold truncate max-w-[100px]">{route.top1.username}</p>
                                                                    <p className="text-neon-yellow text-xs font-black">{route.top1.time}</p>
                                                                </div>
                                                            )}
                                                            <ChevronRight size={20} className="text-tech-grey group-hover:text-neon-yellow transition-colors" />
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}

                            {gpsStatus === 'error' && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                        <MapPin size={32} className="text-red-400" />
                                    </div>
                                    <p className="text-white font-display font-bold text-lg">Erro ao localizar</p>
                                    <p className="text-tech-grey text-sm mt-2">Ative o GPS ou permita acesso à localização</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ranking-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="px-6"
                        >
                            {/* State Filter */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter size={14} className="text-neon-yellow" />
                                    <span className="text-tech-grey text-xs font-bold uppercase tracking-wider">Filtrar por Estado</span>
                                </div>
                                <select
                                    value={selectedStateFilter}
                                    onChange={(e) => setSelectedStateFilter(e.target.value)}
                                    className="w-full bg-surface-dark border border-border-grey rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-neon-yellow transition-colors"
                                >
                                    {BRAZILIAN_STATES.map(state => (
                                        <option key={state.code} value={state.code}>
                                            {state.name} ({state.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Top 3 Podium */}
                            {stateRanking.length >= 3 && (
                                <div className="flex justify-center items-end gap-4 mb-10 pt-8">
                                    {/* 2nd Place - PRATA (Silver) */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl font-black text-gray-700 border-2 border-gray-300 shadow-lg">
                                            {stateRanking[1].username.charAt(0)}
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 text-xs font-black px-3 py-1 rounded-full mt-3 shadow-md">🥈 #2</div>
                                        <p className="text-white text-sm font-bold mt-2 truncate w-20 text-center">{stateRanking[1].username.split(' ')[0]}</p>
                                        <p className="text-gray-400 text-xs">{stateRanking[1].firstPlaces} vitórias</p>
                                    </div>

                                    {/* 1st Place - OURO (Gold) - ELEVATED */}
                                    <div className="flex flex-col items-center -mt-12">
                                        <Crown size={32} className="text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center text-3xl font-black text-amber-900 border-4 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                                            {stateRanking[0].username.charAt(0)}
                                        </div>
                                        <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 text-sm font-black px-4 py-1.5 rounded-full mt-3 shadow-lg">🥇 #1</div>
                                        <p className="text-white text-base font-bold mt-2 truncate w-24 text-center">{stateRanking[0].username.split(' ')[0]}</p>
                                        <p className="text-yellow-400 text-sm font-bold">{stateRanking[0].firstPlaces} vitórias</p>
                                    </div>

                                    {/* 3rd Place - BRONZE */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl font-black text-orange-900 border-2 border-orange-400 shadow-lg">
                                            {stateRanking[2].username.charAt(0)}
                                        </div>
                                        <div className="bg-gradient-to-r from-orange-400 to-amber-600 text-orange-900 text-xs font-black px-3 py-1 rounded-full mt-3 shadow-md">🥉 #3</div>
                                        <p className="text-white text-sm font-bold mt-2 truncate w-20 text-center">{stateRanking[2].username.split(' ')[0]}</p>
                                        <p className="text-orange-400 text-xs">{stateRanking[2].firstPlaces} vitórias</p>
                                    </div>
                                </div>
                            )}

                            {/* Ranking List */}
                            <div className="space-y-2">
                                {stateRanking.slice(3, 100).map((entry, index) => (
                                    <motion.div
                                        key={entry.rank}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.02 * index }}
                                        className="flex items-center gap-3 bg-surface-dark/60 backdrop-blur rounded-xl p-3 border border-border-grey/50"
                                    >
                                        <span className="w-8 text-center text-tech-grey font-bold text-sm">{entry.rank}</span>
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-black text-deep-petrol", entry.avatar)}>
                                            {entry.username.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-sm truncate">{entry.username}</p>
                                            <p className="text-tech-grey text-xs">{entry.city}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-neon-yellow font-black text-sm">{entry.firstPlaces} 🥇</p>
                                            <p className="text-tech-grey text-[10px]">{entry.totalRuns} corridas</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Leaderboard Modal */}
            <AnimatePresence>
                {selectedDistance && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end justify-center"
                        onClick={() => setSelectedDistance(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-surface-dark rounded-t-3xl border-t border-border-grey max-h-[85vh] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-surface-dark/95 backdrop-blur-xl border-b border-border-grey p-5 z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-4xl font-display font-black text-white">{selectedDistance}</span>
                                            <span className="text-xl font-bold text-tech-grey">KM</span>
                                        </div>
                                        <p className="text-tech-grey text-sm">Top 10 em {currentCity}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDistance(null)}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <X size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Leaderboard */}
                            <div className="p-5 space-y-3 overflow-y-auto max-h-[50vh]">
                                {leaderboard.map((entry, index) => (
                                    <motion.div
                                        key={entry.rank}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border",
                                            entry.rank === 1
                                                ? "bg-yellow-500/10 border-yellow-500/30"
                                                : entry.rank === 2
                                                    ? "bg-gray-500/10 border-gray-500/30"
                                                    : entry.rank === 3
                                                        ? "bg-orange-500/10 border-orange-500/30"
                                                        : "bg-white/5 border-border-grey/50"
                                        )}
                                    >
                                        {/* Rank */}
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm",
                                            entry.rank === 1 && "bg-yellow-400 text-deep-petrol",
                                            entry.rank === 2 && "bg-gray-400 text-deep-petrol",
                                            entry.rank === 3 && "bg-orange-400 text-deep-petrol",
                                            entry.rank > 3 && "bg-white/10 text-white"
                                        )}>
                                            {entry.rank}
                                        </div>

                                        {/* Avatar */}
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-black text-deep-petrol", entry.avatar)}>
                                            {entry.username.charAt(0)}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-sm truncate">{entry.username}</p>
                                            <p className="text-tech-grey text-xs">{entry.date}</p>
                                        </div>

                                        {/* Time */}
                                        <div className="text-right">
                                            <p className="text-neon-yellow font-black text-lg">{entry.time}</p>
                                            <p className="text-tech-grey text-[10px]">{entry.pace}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Start Button */}
                            <div className="sticky bottom-0 p-5 bg-gradient-to-t from-surface-dark via-surface-dark to-transparent">
                                <button
                                    onClick={() => handleStartRun(selectedDistance)}
                                    className="w-full bg-gradient-to-r from-neon-yellow to-yellow-400 text-deep-petrol font-display font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(230,255,43,0.4)] hover:shadow-[0_0_40px_rgba(230,255,43,0.6)] transition-shadow"
                                >
                                    <Play size={24} fill="currentColor" />
                                    INICIAR PERCURSO
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
