import { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Star, Trophy, Zap, X, Check, Share2, Loader2 } from 'lucide-react';
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

function calculateStars(pace: string): number {
    const [mins, secs] = pace.split(':').map(Number);
    if (isNaN(mins) || isNaN(secs)) return 1;
    const totalMins = mins + secs / 60;
    if (totalMins < 5) return 3;
    if (totalMins < 7) return 2;
    return 1;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

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

// Story Card Component (9:16 aspect ratio preview)
function StoryCard({ activity, sessionType }: { activity: ActivityData; sessionType: string }) {
    const bounds = getRouteBounds(activity.route);
    const starsEarned = calculateStars(activity.pace);

    return (
        <div className="relative bg-gradient-to-b from-deep-petrol via-surface-dark to-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ aspectRatio: '9/16', width: '100%', maxWidth: '180px' }}>
            {/* Map fills most of the card */}
            <div className="absolute inset-0">
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
                        <Polyline positions={activity.route} color="#E6FF2B" weight={3} opacity={1} />
                    )}
                </MapContainer>
            </div>

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

            {/* Top: App Watermark */}
            <div className="absolute top-3 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-full backdrop-blur-sm">
                    <Zap size={10} className="text-neon-yellow" />
                    <span className="text-[8px] font-display font-black text-white uppercase tracking-wider">CYBER RUN</span>
                </div>
            </div>

            {/* Session Type Badge */}
            {sessionType === 'ranked' && (
                <div className="absolute top-10 left-0 right-0 flex justify-center">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/30 rounded-full border border-amber-500/50">
                        <Trophy size={8} className="text-amber-400" />
                        <span className="text-[7px] font-black text-amber-400 uppercase">RANQUEADA</span>
                    </div>
                </div>
            )}

            {sessionType === 'phase' && (
                <div className="absolute top-10 left-0 right-0 flex justify-center">
                    <div className="flex justify-center gap-0.5">
                        {[1, 2, 3].map((star) => (
                            <Star
                                key={star}
                                size={10}
                                className={star <= starsEarned ? "text-neon-yellow fill-neon-yellow" : "text-white/30"}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom: Stats */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                {/* Main Distance */}
                <div className="text-center mb-2">
                    <p className="text-white font-display font-black text-2xl leading-none">
                        {activity.distance.toFixed(2)}
                    </p>
                    <p className="text-neon-yellow text-[9px] font-bold uppercase tracking-wider">QUILÔMETROS</p>
                </div>

                {/* Time & Pace Row */}
                <div className="flex justify-between gap-2">
                    <div className="flex-1 bg-black/40 rounded-lg py-1.5 px-2 text-center backdrop-blur-sm">
                        <p className="text-white font-display font-black text-sm leading-none">
                            {formatDuration(activity.duration)}
                        </p>
                        <p className="text-tech-grey text-[7px] uppercase mt-0.5">TEMPO</p>
                    </div>
                    <div className="flex-1 bg-black/40 rounded-lg py-1.5 px-2 text-center backdrop-blur-sm">
                        <p className="text-white font-display font-black text-sm leading-none">
                            {activity.pace}
                        </p>
                        <p className="text-tech-grey text-[7px] uppercase mt-0.5">RITMO/KM</p>
                    </div>
                </div>

                {/* RC Earned */}
                <div className="mt-2 text-center">
                    <span className="inline-flex items-center gap-1 text-neon-yellow text-[9px] font-black">
                        <Zap size={8} />+{activity.rcEarned} RC
                    </span>
                </div>
            </div>
        </div>
    );
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

    const handleSave = async () => {
        if (isSaving || isSaved) return;
        setIsSaving(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setError('Você precisa estar logado para salvar');
                setIsSaving(false);
                return;
            }

            const runType = sessionType === 'ranked' ? 'ranked' : 'phase';

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-surface-dark border border-border-grey rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-4 pb-2 text-center">
                    {sessionType === 'hub' && (
                        <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
                            Missão Completa!
                        </h2>
                    )}
                    {sessionType === 'phase' && phaseInfo && (
                        <>
                            <p className="text-neon-yellow text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                {phaseInfo.worldName}
                            </p>
                            <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
                                Fase {phaseInfo.id} Completa!
                            </h2>
                        </>
                    )}
                    {sessionType === 'ranked' && rankedInfo && (
                        <>
                            <div className="inline-flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/50 mb-1">
                                <Trophy size={12} className="text-amber-400" />
                                <span className="text-amber-400 font-black text-[10px] uppercase">Ranqueada</span>
                            </div>
                            <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
                                {rankedInfo.km} KM Completos!
                            </h2>
                        </>
                    )}
                </div>

                {/* Story Card Preview - Centered */}
                <div className="flex justify-center py-3">
                    <StoryCard activity={activity} sessionType={sessionType} />
                </div>

                {/* Name Input (Hub only) */}
                {sessionType === 'hub' && (
                    <div className="px-4 pb-2">
                        <input
                            type="text"
                            value={routeName}
                            onChange={(e) => setRouteName(e.target.value)}
                            placeholder="Nome da corrida (opcional)"
                            className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-2 text-white placeholder:text-tech-grey focus:outline-none focus:border-neon-yellow/50 text-sm"
                            disabled={isSaved}
                        />
                    </div>
                )}

                {/* Error */}
                {error && <p className="text-red-400 text-xs text-center px-4 pb-2">{error}</p>}

                {/* Buttons */}
                <div className="p-4 pt-2 space-y-2">
                    {!isSaved ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-neon-yellow text-deep-petrol font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider text-sm hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                            ) : (
                                <><Check size={16} /> Salvar Atividade</>
                            )}
                        </button>
                    ) : (
                        <div className="w-full bg-green-600/20 border border-green-500/50 text-green-400 font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                            <Check size={16} /> Salvo!
                        </div>
                    )}

                    {isSaved && !isPosted && (
                        <button
                            onClick={handlePostToFeed}
                            disabled={isPosting}
                            className="w-full bg-white/10 text-white font-display font-bold py-2.5 rounded-2xl border border-white/20 flex items-center justify-center gap-2 uppercase tracking-wider text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                            {isPosting ? (
                                <><Loader2 size={14} className="animate-spin" /> Postando...</>
                            ) : (
                                <><Share2 size={14} /> Postar no Feed</>
                            )}
                        </button>
                    )}

                    {isPosted && (
                        <div className="w-full bg-blue-600/20 border border-blue-500/50 text-blue-400 font-display font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                            <Share2 size={14} /> Postado!
                        </div>
                    )}

                    <button
                        onClick={isSaved ? handleFinish : onCancel}
                        className="w-full text-tech-grey font-display font-bold py-2 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider text-xs hover:text-white transition-colors"
                    >
                        {isSaved ? 'Fechar' : <><X size={14} /> Cancelar</>}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
