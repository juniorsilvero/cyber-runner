import { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Star, Trophy, MapPin, Clock, Zap, X, Check, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveRun, shareToFeed } from '../services/activityService';
import { supabase } from '../lib/supabase';

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

    if (totalMins < 5) return 3;
    if (totalMins < 7) return 2;
    return 1;
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
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isPosted, setIsPosted] = useState(false);
    const [savedRunId, setSavedRunId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const starsEarned = calculateStars(activity.pace);
    const bounds = getRouteBounds(activity.route);

    const handleSave = async () => {
        if (isSaving || isSaved) return;

        setIsSaving(true);
        setError(null);

        try {
            // Get current user
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setError('Você precisa estar logado para salvar');
                setIsSaving(false);
                return;
            }

            // Determine run type
            const runType = sessionType === 'ranked' ? 'ranked' : 'phase';

            // Save to Supabase
            const { data: savedRun, error: saveError } = await saveRun(session.user.id, {
                type: runType,
                distance: activity.distance,
                duration: activity.duration,
                pace: activity.pace,
                route: activity.route,
                name: routeName || `Corrida ${new Date().toLocaleDateString()}`,
                rankedDistanceKm: rankedInfo?.km,
                stars: starsEarned
            });

            if (saveError) {
                console.error('Save error:', saveError);
                setError('Erro ao salvar. Tente novamente.');
                setIsSaving(false);
                return;
            }

            if (savedRun) {
                setSavedRunId(savedRun.id);
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Save exception:', err);
            setError('Erro ao salvar. Tente novamente.');
        }

        setIsSaving(false);
    };

    const handlePostToFeed = async () => {
        if (isPosting || isPosted || !savedRunId) return;

        setIsPosting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            const message = `Acabei de correr ${activity.distance.toFixed(2)}km em ${formatDuration(activity.duration)}! 🏃‍♂️`;

            const { error: postError } = await shareToFeed(session.user.id, savedRunId, message);

            if (!postError) {
                setIsPosted(true);
            }
        } catch (err) {
            console.error('Post error:', err);
        }

        setIsPosting(false);
    };

    const handleFinish = () => {
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
                className="bg-surface-dark border border-border-grey rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
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
                <div className="h-40 relative">
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

                    <div className="absolute top-3 right-3 bg-neon-yellow text-deep-petrol px-3 py-1 rounded-full font-black text-sm flex items-center gap-1">
                        <Zap size={14} />
                        +{activity.rcEarned} RC
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 p-3 border-t border-white/10">
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-0.5">Distância</p>
                        <p className="text-white font-display font-black text-lg">
                            {activity.distance.toFixed(2)} <span className="text-xs">km</span>
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-tech-grey text-xs font-bold uppercase mb-0.5">
                            <Clock size={10} />
                            <span>Tempo</span>
                        </div>
                        <p className="text-white font-display font-black text-lg">
                            {formatDuration(activity.duration)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-0.5">Ritmo</p>
                        <p className="text-white font-display font-black text-lg">
                            {activity.pace} <span className="text-xs">/km</span>
                        </p>
                    </div>
                </div>

                {/* Name Input (Hub only) */}
                {sessionType === 'hub' && (
                    <div className="px-4 pb-3">
                        <input
                            type="text"
                            value={routeName}
                            onChange={(e) => setRouteName(e.target.value)}
                            placeholder="Ex: Corrida matinal no parque"
                            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-tech-grey focus:outline-none focus:border-neon-yellow/50 text-sm"
                            disabled={isSaved}
                        />
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="px-4 pb-3">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 pt-0 space-y-3">
                    {/* Save Button */}
                    {!isSaved ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-neon-yellow text-deep-petrol font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Check size={18} />
                                    Salvar Atividade
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="w-full bg-green-600/20 border border-green-500/50 text-green-400 font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider">
                            <Check size={18} />
                            Salvo com Sucesso!
                        </div>
                    )}

                    {/* Post to Feed Button (only show after saved) */}
                    {isSaved && !isPosted && (
                        <button
                            onClick={handlePostToFeed}
                            disabled={isPosting}
                            className="w-full bg-white/10 text-white font-display font-bold py-3 rounded-2xl border border-white/20 flex items-center justify-center gap-2 uppercase tracking-wider hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                            {isPosting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Postando...
                                </>
                            ) : (
                                <>
                                    <Share2 size={18} />
                                    Postar no Feed
                                </>
                            )}
                        </button>
                    )}

                    {isPosted && (
                        <div className="w-full bg-blue-600/20 border border-blue-500/50 text-blue-400 font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider">
                            <Share2 size={18} />
                            Postado no Feed!
                        </div>
                    )}

                    {/* Finish/Close Button */}
                    <button
                        onClick={isSaved ? handleFinish : onCancel}
                        className="w-full bg-white/5 text-tech-grey font-display font-bold py-3 rounded-2xl border border-white/10 flex items-center justify-center gap-2 uppercase tracking-wider hover:bg-white/10 transition-colors text-sm"
                    >
                        {isSaved ? 'Fechar' : (
                            <>
                                <X size={16} />
                                Cancelar
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
