import { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Star, Trophy, MapPin, Clock, Zap, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

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
    sessionType?: 'hub' | 'phase' | 'ranked';
    phaseInfo?: { id: number; kmTarget: number; worldName: string };
    rankedInfo?: { km: number; city: string };
    starsEarned?: number;
}

interface ActivityCompletionModalProps {
    activity: ActivityData;
    sessionType: 'hub' | 'phase' | 'ranked';
    phaseInfo?: { id: number; kmTarget: number; worldName: string };
    rankedInfo?: { km: number; city: string };
    onConfirm: (activity: ActivityData) => void;
    onCancel: () => void;
}

// Calculate stars based on pace (min/km)
function calculateStars(pace: string): number {
    const [mins, secs] = pace.split(':').map(Number);
    if (isNaN(mins) || isNaN(secs)) return 1;
    const totalMins = mins + secs / 60;

    if (totalMins < 5) return 3; // Under 5:00/km = 3 stars
    if (totalMins < 7) return 2; // Under 7:00/km = 2 stars
    return 1; // 1 star for completing
}

// Format duration as MM:SS
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get map bounds from route
function getRouteBounds(route: [number, number][]): [[number, number], [number, number]] {
    if (route.length === 0) return [[-27.0258, -48.6514], [-27.0258, -48.6514]];

    let minLat = route[0][0], maxLat = route[0][0];
    let minLng = route[0][1], maxLng = route[0][1];

    route.forEach(([lat, lng]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
    });

    // Add padding
    const latPadding = (maxLat - minLat) * 0.2 || 0.005;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.005;

    return [
        [minLat - latPadding, minLng - lngPadding],
        [maxLat + latPadding, maxLng + lngPadding]
    ];
}

export function ActivityCompletionModal({
    activity,
    sessionType,
    phaseInfo,
    rankedInfo,
    onConfirm,
    onCancel
}: ActivityCompletionModalProps) {
    const [routeName, setRouteName] = useState(activity.name || '');
    const starsEarned = calculateStars(activity.pace);
    const bounds = getRouteBounds(activity.route);

    const handleConfirm = () => {
        const finalActivity = {
            ...activity,
            name: routeName || `Corrida ${new Date().toLocaleDateString()}`,
            sessionType,
            phaseInfo,
            rankedInfo,
            starsEarned
        };
        onConfirm(finalActivity);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-surface-dark border border-border-grey rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
                {/* Header based on session type */}
                <div className="p-4 border-b border-white/10">
                    {sessionType === 'hub' && (
                        <div className="text-center">
                            <h2 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                                Missão Completa!
                            </h2>
                            <p className="text-tech-grey text-sm mt-1">Dê um nome para sua rota</p>
                        </div>
                    )}

                    {sessionType === 'phase' && phaseInfo && (
                        <div className="text-center">
                            <p className="text-neon-yellow text-xs font-bold uppercase tracking-wider mb-1">
                                {phaseInfo.worldName}
                            </p>
                            <h2 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                                Fase {phaseInfo.id} Completa!
                            </h2>
                            <div className="flex justify-center gap-1 mt-2">
                                {[1, 2, 3].map((star) => (
                                    <Star
                                        key={star}
                                        size={28}
                                        className={star <= starsEarned
                                            ? "text-neon-yellow fill-neon-yellow"
                                            : "text-white/20"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {sessionType === 'ranked' && rankedInfo && (
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-1.5 rounded-full border border-amber-500/50 mb-2">
                                <Trophy size={16} className="text-amber-400" />
                                <span className="text-amber-400 font-black text-sm uppercase">Corrida Ranqueada</span>
                            </div>
                            <h2 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                                {rankedInfo.km} KM
                            </h2>
                            <div className="flex items-center justify-center gap-1 text-tech-grey text-sm mt-1">
                                <MapPin size={14} />
                                <span>{rankedInfo.city}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Route Map */}
                <div className="h-48 relative">
                    <MapContainer
                        bounds={bounds}
                        className="w-full h-full"
                        zoomControl={false}
                        attributionControl={false}
                        dragging={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        touchZoom={false}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        {activity.route.length > 1 && (
                            <Polyline
                                positions={activity.route}
                                color="#E6FF2B"
                                weight={4}
                                opacity={1}
                            />
                        )}
                    </MapContainer>

                    {/* RC Earned Badge */}
                    <div className="absolute top-3 right-3 bg-neon-yellow text-deep-petrol px-3 py-1 rounded-full font-black text-sm flex items-center gap-1">
                        <Zap size={14} />
                        +{activity.rcEarned} RC
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 p-4 border-t border-white/10">
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-1">Distância</p>
                        <p className="text-white font-display font-black text-xl">
                            {activity.distance.toFixed(2)} <span className="text-sm">km</span>
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-tech-grey text-xs font-bold uppercase mb-1">
                            <Clock size={10} />
                            <span>Tempo</span>
                        </div>
                        <p className="text-white font-display font-black text-xl">
                            {formatDuration(activity.duration)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-1">Ritmo</p>
                        <p className="text-white font-display font-black text-xl">
                            {activity.pace} <span className="text-sm">/km</span>
                        </p>
                    </div>
                </div>

                {/* Name Input (Hub only) */}
                {sessionType === 'hub' && (
                    <div className="px-4 pb-4">
                        <input
                            type="text"
                            value={routeName}
                            onChange={(e) => setRouteName(e.target.value)}
                            placeholder="Ex: Corrida matinal no parque"
                            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-tech-grey focus:outline-none focus:border-neon-yellow/50"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 p-4 pt-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-white/10 text-white font-display font-bold py-4 rounded-2xl border border-white/20 flex items-center justify-center gap-2 uppercase tracking-wider hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 bg-neon-yellow text-deep-petrol font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider hover:brightness-110 transition-all"
                    >
                        <Check size={18} />
                        Salvar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
