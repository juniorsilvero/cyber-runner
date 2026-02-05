import { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { X, Clock, MapPin, Zap, Calendar, Share2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Activity } from '../services/activityService';
import { shareToFeed } from '../services/activityService';

interface ActivityDetailModalProps {
    activity: Activity;
    userId: string;
    onClose: () => void;
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

    const latPadding = (maxLat - minLat) * 0.2 || 0.005;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.005;

    return [
        [minLat - latPadding, minLng - lngPadding],
        [maxLat + latPadding, maxLng + lngPadding]
    ];
}

// Format duration as HH:MM:SS or MM:SS
function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// Format date
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function ActivityDetailModal({ activity, userId, onClose }: ActivityDetailModalProps) {
    const [isSharing, setIsSharing] = useState(false);
    const [shared, setShared] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);

    const bounds = getRouteBounds(activity.gps_path);
    const hasRoute = activity.gps_path && activity.gps_path.length > 1;

    const handleShare = async () => {
        setIsSharing(true);
        setShareError(null);

        const message = `Acabei de correr ${activity.distance_km.toFixed(2)}km em ${formatDuration(activity.duration_seconds)}! 🏃‍♂️`;

        const { error } = await shareToFeed(userId, activity.id, message);

        if (error) {
            setShareError('Erro ao compartilhar. Tente novamente.');
        } else {
            setShared(true);
        }

        setIsSharing(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-surface-dark border border-border-grey rounded-3xl w-full max-w-sm max-h-[90vh] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-4 border-b border-white/10">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={18} className="text-white" />
                        </button>

                        <div className="pr-10">
                            <p className="text-neon-yellow text-xs font-bold uppercase tracking-wider mb-1">
                                {activity.type === 'ranked' ? '🏆 Ranqueada' : activity.type === 'phase' ? '🎯 Fase' : '🏃 Corrida Livre'}
                            </p>
                            <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
                                {activity.distance_km.toFixed(2)} KM
                            </h2>
                            <div className="flex items-center gap-2 text-tech-grey text-sm mt-1">
                                <Calendar size={12} />
                                <span>{formatDate(activity.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Route Map */}
                    {hasRoute ? (
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
                                <Polyline
                                    positions={activity.gps_path}
                                    color="#E6FF2B"
                                    weight={4}
                                    opacity={1}
                                />
                            </MapContainer>
                        </div>
                    ) : (
                        <div className="h-32 bg-black/30 flex items-center justify-center">
                            <p className="text-tech-grey text-sm">Sem dados de rota</p>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 p-4">
                        <div className="bg-black/30 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-tech-grey text-xs font-bold uppercase mb-1">
                                <MapPin size={12} />
                                <span>Distância</span>
                            </div>
                            <p className="text-white font-display font-black text-lg">
                                {activity.distance_km.toFixed(2)} <span className="text-xs">km</span>
                            </p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-tech-grey text-xs font-bold uppercase mb-1">
                                <Clock size={12} />
                                <span>Tempo</span>
                            </div>
                            <p className="text-white font-display font-black text-lg">
                                {formatDuration(activity.duration_seconds)}
                            </p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-3 text-center">
                            <p className="text-tech-grey text-xs font-bold uppercase mb-1">Ritmo</p>
                            <p className="text-white font-display font-black text-lg">
                                {activity.pace} <span className="text-xs">/km</span>
                            </p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-tech-grey text-xs font-bold uppercase mb-1">
                                <Zap size={12} />
                                <span>RC Ganhos</span>
                            </div>
                            <p className="text-neon-yellow font-display font-black text-lg">
                                +{Math.floor(activity.distance_km * 20)}
                            </p>
                        </div>
                    </div>

                    {/* Location */}
                    {activity.city && (
                        <div className="px-4 pb-3 flex items-center gap-2 text-tech-grey text-sm">
                            <MapPin size={14} />
                            <span>{activity.city}{activity.state_code ? `, ${activity.state_code}` : ''}</span>
                        </div>
                    )}

                    {/* Share Button */}
                    <div className="p-4 pt-0">
                        {shared ? (
                            <div className="bg-green-600/20 border border-green-500/50 text-green-400 font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider">
                                <CheckCircle size={18} />
                                Compartilhado no Feed!
                            </div>
                        ) : (
                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                className="w-full bg-neon-yellow text-deep-petrol font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
                            >
                                {isSharing ? (
                                    <span>Compartilhando...</span>
                                ) : (
                                    <>
                                        <Share2 size={18} />
                                        <span>Compartilhar no Feed</span>
                                    </>
                                )}
                            </button>
                        )}

                        {shareError && (
                            <p className="text-red-400 text-sm text-center mt-2">{shareError}</p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
