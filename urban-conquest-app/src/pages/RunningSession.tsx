import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Square } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface RunningSessionProps {
    onFinish: (activity: any) => void;
    onCancel: () => void;
}

// Helper component to update map center
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 16);
    }, [center, map]);
    return null;
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Format time as MM:SS
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format pace as MM:SS/km
function formatPace(kmPerHour: number): string {
    if (kmPerHour === 0) return '--:--';
    const minPerKm = 60 / kmPerHour;
    const mins = Math.floor(minPerKm);
    const secs = Math.round((minPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function RunningSession({ onFinish, onCancel }: RunningSessionProps) {
    const [isTracking, setIsTracking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [currentPosition, setCurrentPosition] = useState<[number, number]>([-27.0258, -48.6514]);
    const [distance, setDistance] = useState(0); // in km
    const [duration, setDuration] = useState(0); // in seconds
    const [pace, setPace] = useState('--:--');

    const watchIdRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);

    // Start tracking
    const handleStart = () => {
        if (!navigator.geolocation) {
            alert('Geolocalização não suportada pelo seu navegador');
            return;
        }

        setIsTracking(true);
        setIsPaused(false);
        startTimeRef.current = Date.now() - pausedTimeRef.current;

        // Start timer
        timerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setDuration(elapsed);
        }, 1000);

        // Start GPS tracking
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPos: [number, number] = [latitude, longitude];

                setCurrentPosition(newPos);

                setRoute((prevRoute) => {
                    const newRoute = [...prevRoute, newPos];

                    // Calculate distance
                    if (prevRoute.length > 0) {
                        const lastPos = prevRoute[prevRoute.length - 1];
                        const dist = calculateDistance(lastPos[0], lastPos[1], latitude, longitude);
                        setDistance((prevDist) => {
                            const newDist = prevDist + dist;
                            // Calculate pace
                            const hours = duration / 3600;
                            if (hours > 0 && newDist > 0) {
                                const kmPerHour = newDist / hours;
                                setPace(formatPace(kmPerHour));
                            }
                            return newDist;
                        });
                    }

                    return newRoute;
                });
            },
            (error) => {
                console.error('GPS Error:', error);
                alert('Erro ao obter localização. Verifique as permissões.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    // Pause tracking
    const handlePause = () => {
        setIsPaused(true);
        pausedTimeRef.current = Date.now() - startTimeRef.current;

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Resume tracking
    const handleResume = () => {
        handleStart();
    };

    // Stop and save
    const handleStop = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Save activity
        const activity = {
            id: Date.now().toString(),
            type: 'corrida' as const,
            route,
            distance: parseFloat(distance.toFixed(2)),
            duration,
            pace,
            rcEarned: Math.floor(distance * 20), // 20 RC per km
            timestamp: Date.now(),
            name: `Corrida ${new Date().toLocaleDateString()}`
        };

        onFinish(activity);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-cyber-black">
            {/* Header */}
            <div className="relative z-10 px-6 pt-6 flex justify-between items-center bg-cyber-black/90 backdrop-blur-md pb-4 border-b border-white/5">
                <button onClick={onCancel} className="bg-surface-dark p-2 rounded-full border border-white/10 hover:border-white text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-display font-bold text-xl text-white tracking-wider uppercase">
                    Missão em Andamento
                </h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <MapContainer
                    center={currentPosition}
                    zoom={16}
                    className="w-full h-full z-10"
                    zoomControl={false}
                    attributionControl={false}
                >
                    <ChangeView center={currentPosition} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                    {/* Current position marker */}
                    <Marker position={currentPosition} />

                    {/* Route polyline */}
                    {route.length > 1 && (
                        <Polyline
                            positions={route}
                            color="#E6FF2B"
                            weight={5}
                            opacity={1}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Stats Panel */}
            <div className="relative z-10 bg-surface-dark border-t border-white/10 p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-1">Distância</p>
                        <p className="text-white font-display font-black text-2xl">{distance.toFixed(2)} <span className="text-sm">KM</span></p>
                    </div>
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-1">Tempo</p>
                        <p className="text-white font-display font-black text-2xl">{formatTime(duration)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-tech-grey text-xs font-bold uppercase mb-1">Ritmo</p>
                        <p className="text-white font-display font-black text-2xl">{pace} <span className="text-sm">/km</span></p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    {!isTracking ? (
                        <button
                            onClick={handleStart}
                            className="flex-1 bg-neon-yellow text-deep-petrol font-display font-black text-xl py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            <Play fill="currentColor" size={24} />
                            <span>Iniciar</span>
                        </button>
                    ) : (
                        <>
                            {!isPaused ? (
                                <button
                                    onClick={handlePause}
                                    className="flex-1 bg-white/10 text-white font-display font-black text-lg py-5 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                                >
                                    <Pause size={20} />
                                    <span>Pausar</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleResume}
                                    className="flex-1 bg-neon-yellow text-deep-petrol font-display font-black text-lg py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                                >
                                    <Play fill="currentColor" size={20} />
                                    <span>Continuar</span>
                                </button>
                            )}
                            <button
                                onClick={handleStop}
                                className="flex-1 bg-red-600 text-white font-display font-black text-lg py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                            >
                                <Square fill="currentColor" size={20} />
                                <span>Parar</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
