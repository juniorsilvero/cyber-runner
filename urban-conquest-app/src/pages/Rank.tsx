import * as React from "react";
import {
    Trophy,
    MapPin,
    Map as MapIcon,
    Zap,
    Target,
    Activity
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
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

import { fetchRoute } from '../services/osrm';

// ... (existing imports)

// Routes initialized with sparse waypoints (Corners). The OSRM service will fill in the street geometry.
// Routes initialized with sparse waypoints (Corners). The OSRM service will fill in the street geometry.
const routesData = [
    {
        id: 1,
        name: "CIRCUITO CENTRO",
        neighbourhood: "Centro",
        distance: "2.1 KM",
        type: "Corrida",
        dominator: "Juninho",
        avatar: "bg-neon-yellow",
        time: "09:12",
        center: [-27.0258, -48.6514] as [number, number],
        path: [[-27.0258, -48.6514], [-27.0270, -48.6530], [-27.0240, -48.6520]]
    },
    {
        id: 2,
        name: "MONTE ALEGRE SPRINT",
        neighbourhood: "Monte Alegre",
        distance: "1.2 KM",
        type: "Sprint",
        dominator: "Ricardo",
        avatar: "bg-purple-500",
        time: "04:30",
        center: [-27.0150, -48.6450] as [number, number],
        path: [[-27.0150, -48.6450], [-27.0160, -48.6470]]
    },
    {
        id: 3,
        name: "RIO PEQUENO DASH",
        neighbourhood: "Rio Pequeno",
        distance: "3.5 KM",
        type: "Corrida",
        dominator: "Aquila",
        avatar: "bg-emerald-500",
        time: "15:20",
        center: [-27.0350, -48.6600] as [number, number],
        path: [[-27.0350, -48.6600], [-27.0380, -48.6650]]
    },
    {
        id: 4,
        name: "AREIAS LOOP",
        neighbourhood: "Areias",
        distance: "1.8 KM",
        type: "Caminhada",
        dominator: "Eliabe",
        avatar: "bg-blue-500",
        time: "12:10",
        center: [-27.0180, -48.6550] as [number, number],
        path: [[-27.0180, -48.6550], [-27.0200, -48.6580], [-27.0190, -48.6540]]
    },
    {
        id: 5,
        name: "CEDROS CHALLENGE",
        neighbourhood: "Cedros",
        distance: "4.2 KM",
        type: "Corrida",
        dominator: "Clovis",
        avatar: "bg-orange-500",
        time: "18:45",
        center: [-27.0280, -48.6650] as [number, number],
        path: [[-27.0280, -48.6650], [-27.0300, -48.6700]]
    },
    {
        id: 6,
        name: "SANTA REGINA RUN",
        neighbourhood: "Santa Regina",
        distance: "2.5 KM",
        type: "Corrida",
        dominator: "Porto",
        avatar: "bg-pink-500",
        time: "11:30",
        center: [-27.0400, -48.6700] as [number, number],
        path: [[-27.0400, -48.6700], [-27.0420, -48.6750]]
    },
    {
        id: 7,
        name: "TABULEIRO TRACK",
        neighbourhood: "Tabuleiro",
        distance: "1.5 KM",
        type: "Sprint",
        dominator: "Jhon",
        avatar: "bg-red-500",
        time: "06:15",
        center: [-27.0120, -48.6380] as [number, number],
        path: [[-27.0120, -48.6380], [-27.0140, -48.6400]]
    },

    {
        id: 9,
        name: "CONDE VILA VERDE",
        neighbourhood: "Monte Alegre",
        distance: "2.0 KM",
        type: "Caminhada",
        dominator: "Ricardo",
        avatar: "bg-purple-500",
        time: "14:00",
        center: [-27.0160, -48.6420] as [number, number],
        path: [[-27.0160, -48.6420], [-27.0180, -48.6440]]
    },

];

const userRanking = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Player_${i + 1}`,
    km: (120 - i * 8.5).toFixed(1),
    territories: Math.floor(Math.random() * 5),
    avatar: ["bg-purple-500", "bg-neon-yellow", "bg-emerald-500", "bg-blue-500"][i % 4],
}));

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
}

export function Rank() {
    const [view, setView] = React.useState<'map' | 'ranking'>('map');
    const [selectedTerritory, setSelectedTerritory] = React.useState<any>(null);
    const [userLocation, setUserLocation] = React.useState<[number, number]>([-27.0258, -48.6514]);
    const [neighbourhood, setNeighbourhood] = React.useState("CAMBORIÚ");
    const [isAntiTrapVisible, setIsAntiTrapVisible] = React.useState(false);

    // State to hold the Real Snapped Routes
    const [realRoutes, setRealRoutes] = React.useState<any[]>(routesData);

    // Fetch Real Routes on Mount
    React.useEffect(() => {
        const loadRoutes = async () => {
            const updatedRoutes = await Promise.all(routesData.map(async (route) => {
                const snappedPath = await fetchRoute(route.path as [number, number][]);
                return { ...route, path: snappedPath };
            }));
            setRealRoutes(updatedRoutes);
        };
        loadRoutes();
    }, []);



    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // Only update if significantly different to assume user is actually there, 
                // otherwise keep default SP center for demo purposes if user is far away.
                // For this demo, we will center on the user but keep the territories in SP.
                setUserLocation([latitude, longitude]);

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await res.json();
                    const b = data.address.suburb || data.address.neighbourhood || data.address.city_district || "Região Central";
                    setNeighbourhood(b.toUpperCase());
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }, []);

    const currentTop = userRanking.slice(0, 3);
    const restRanking = userRanking.slice(3);

    return (
        <div className="flex flex-col h-full bg-cyber-black overflow-hidden relative font-body antialiased">
            <div className="absolute top-0 left-0 right-0 z-[1000] p-6 flex flex-col gap-4">
                <div className="flex bg-surface-dark/80 backdrop-blur-xl p-1.5 rounded-2xl border border-border-grey shadow-2xl self-center min-w-[300px]">
                    <button onClick={() => setView('map')} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all", view === 'map' ? "bg-neon-yellow text-deep-petrol shadow-lg" : "text-tech-grey")}>
                        <MapIcon size={18} strokeWidth={2.5} />
                        <span className="font-display font-black text-[11px] uppercase tracking-widest">Ranqueada</span>
                    </button>
                    <button onClick={() => setView('ranking')} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all", view === 'ranking' ? "bg-neon-yellow text-deep-petrol shadow-lg" : "text-tech-grey")}>
                        <Trophy size={18} strokeWidth={2.5} />
                        <span className="font-display font-black text-[11px] uppercase tracking-widest">Ranking</span>
                    </button>
                </div>

                {view === 'map' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-border-grey shadow-lg">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-neon-yellow" />
                            <div className="flex flex-col text-white">
                                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{neighbourhood}</span>
                                <span className="text-[8px] opacity-40 font-bold uppercase mt-1">Sua Região Central</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="flex flex-col items-end border-r border-white/10 pr-3">
                                <span className="text-[12px] font-black leading-none">{routesData.length}</span>
                                <span className="text-[7px] font-bold uppercase opacity-40">ZONAS</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[12px] font-black leading-none">452</span>
                                <span className="text-[7px] font-bold uppercase opacity-40 text-right">ATIVOS</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {view === 'map' ? (
                        <motion.div key="map-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                            <MapContainer center={userLocation} zoom={15} className="w-full h-full z-10" zoomControl={false} attributionControl={false}>
                                <ChangeView center={selectedTerritory ? selectedTerritory.center : userLocation} />
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={userLocation} />
                                {realRoutes.map((route) => {
                                    const customIcon = L.divIcon({
                                        className: 'custom-marker',
                                        html: `
                                            <div class="relative flex flex-col items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                                                <div class="relative">
                                                    <div class="w-12 h-12 bg-black rounded-xl border-2 border-neon-yellow flex items-center justify-center shadow-[0_0_15px_rgba(230,255,43,0.5)]">
                                                        <span class="text-neon-yellow font-black text-xl">${route.dominator.charAt(0)}</span>
                                                    </div>
                                                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-neon-yellow rotate-45 border-r border-b border-black"></div>
                                                </div>
                                                <div class="mt-1 bg-black/90 px-2 py-0.5 rounded border border-white/20 backdrop-blur-sm">
                                                    <span class="text-[8px] font-black text-white uppercase tracking-wider">${route.dominator}</span>
                                                </div>
                                            </div>
                                        `,
                                        iconSize: [40, 60],
                                        iconAnchor: [20, 60],
                                    });

                                    return (
                                        <React.Fragment key={route.id}>
                                            <Polyline
                                                positions={route.path}
                                                color="#CCFF00"
                                                weight={selectedTerritory?.id === route.id ? 8 : 5}
                                                opacity={1}
                                                eventHandlers={{ click: () => setSelectedTerritory(route) }}
                                            />
                                            <Marker
                                                position={route.center}
                                                icon={customIcon}
                                                eventHandlers={{ click: () => setSelectedTerritory(route) }}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </MapContainer>
                            <button onClick={() => setSelectedTerritory(null)} className="absolute bottom-32 right-6 z-[1000] bg-black/80 p-4 rounded-2xl border border-white/10 text-white shadow-2xl transition-all">
                                <Target size={22} strokeWidth={2.5} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div key="rank-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full pt-32 pb-24 overflow-y-auto px-6">
                            <div className="flex justify-center items-end gap-3 mb-10 mt-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl border-2 border-gray-400 p-1 mb-3 bg-surface-dark relative">
                                        <div className={cn("w-full h-full rounded-xl flex items-center justify-center text-deep-petrol font-black text-xl", currentTop[1].avatar)}>{currentTop[1].name.charAt(0)}</div>
                                        <div className="absolute -bottom-2 bg-gray-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">#2</div>
                                    </div>
                                    <span className="text-white font-black text-[10px] uppercase mb-1">{currentTop[1].name}</span>
                                    <span className="text-white/40 text-[9px] font-black">{currentTop[1].km} KM</span>
                                </div>
                                <div className="flex flex-col items-center -mt-8">
                                    <Trophy size={24} className="text-yellow-400 mb-2" />
                                    <div className="w-20 h-20 rounded-2xl border-4 border-yellow-400 p-1 mb-3 bg-surface-dark relative shadow-xl">
                                        <div className={cn("w-full h-full rounded-xl flex items-center justify-center text-deep-petrol font-black text-3xl", currentTop[0].avatar)}>{currentTop[0].name.charAt(0)}</div>
                                        <div className="absolute -bottom-2 bg-yellow-400 text-deep-petrol text-[11px] font-black px-3 py-1 rounded-full shadow-xl">#1</div>
                                    </div>
                                    <span className="text-white font-black text-[12px] uppercase mb-1">{currentTop[0].name}</span>
                                    <span className="text-neon-yellow text-[11px] font-black">{currentTop[0].km} KM</span>
                                </div>
                                <div className="flex flex-col items-center text-white">
                                    <div className="w-16 h-16 rounded-2xl border-2 border-orange-400 p-1 mb-3 bg-surface-dark relative">
                                        <div className={cn("w-full h-full rounded-xl flex items-center justify-center text-deep-petrol font-black text-xl", currentTop[2].avatar)}>{currentTop[2].name.charAt(0)}</div>
                                        <div className="absolute -bottom-2 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">#3</div>
                                    </div>
                                    <span className="font-black text-[10px] uppercase mb-1 tracking-tighter">{currentTop[2].name}</span>
                                    <span className="opacity-40 text-[9px] font-black">{currentTop[2].km} KM</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {restRanking.map((user, idx) => (
                                    <div key={user.id} className="bg-surface-dark border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                                        <div className="flex items-center gap-5">
                                            <span className="text-white/20 font-black text-xs w-6">{idx + 4}</span>
                                            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-deep-petrol font-black text-lg", user.avatar)}>{user.name.charAt(0)}</div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-black uppercase tracking-tight">{user.name}</span>
                                                <span className="text-[9px] text-white/40 font-black tracking-widest">{user.territories} TERRITÓRIOS</span>
                                            </div>
                                        </div>
                                        <span className="text-neon-yellow font-black text-sm tracking-tighter">{user.km} KM</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedTerritory && (
                    <div className="fixed inset-0 z-[2000] flex items-end justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={() => setSelectedTerritory(null)} />
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
                                    setSelectedTerritory(null);
                                }
                            }}
                            className="bg-surface-dark border-t border-x border-border-grey w-full max-w-lg rounded-t-[2.5rem] p-6 pb-10 shadow-2xl relative pointer-events-auto max-h-[85vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-neon-yellow/10 px-4 py-1.5 rounded-full border border-neon-yellow/20 mb-3">
                                    <span className="text-neon-yellow font-black text-[9px] tracking-[0.2em] uppercase">{selectedTerritory.neighbourhood}</span>
                                </div>
                                <h3 className="font-display font-black text-4xl text-white uppercase tracking-tighter mb-4 leading-none">{selectedTerritory.name}</h3>
                                <div className="grid grid-cols-2 w-full gap-4 mb-8">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-white">
                                        <span className="opacity-40 font-black text-[9px] uppercase block mb-1">DISTÂNCIA</span>
                                        <span className="font-black text-2xl tracking-tighter block">{selectedTerritory.distance}</span>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <span className="text-white/40 font-black text-[9px] uppercase block mb-1">RECORDE</span>
                                        <span className="text-neon-yellow font-black text-2xl tracking-tighter block">{selectedTerritory.time}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-white/5 rounded-3xl p-6 border border-border-grey mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl", selectedTerritory.avatar)}>{selectedTerritory.dominator?.charAt(0) || "?"}</div>
                                        <div className="text-left font-display text-white">
                                            <span className="opacity-40 font-black text-[9px] tracking-widest uppercase mb-1 block">DOMINADOR ATUAL</span>
                                            <h4 className="text-xl font-black uppercase leading-none">{selectedTerritory.dominator || "Vago"}</h4>
                                        </div>
                                    </div>
                                    <Activity className="text-white/20" size={24} />
                                </div>
                                <button onClick={() => setIsAntiTrapVisible(true)} className="w-full bg-neon-yellow text-deep-petrol font-display font-black text-2xl py-6 rounded-3xl shadow-2xl transition-all flex items-center justify-center gap-4 uppercase tracking-widest">
                                    <Zap fill="currentColor" size={28} />
                                    <span>INICIAR DISPUTA</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAntiTrapVisible && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6" onClick={() => setIsAntiTrapVisible(false)}>
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-surface-dark border border-border-grey rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                            <Activity size={50} className="text-neon-yellow animate-pulse mb-8 mx-auto" />
                            <h2 className="font-display font-black text-3xl text-white mb-6 uppercase tracking-tight text-center">ANTI-FRAUDE</h2>
                            <p className="text-white/50 text-sm mb-10 font-bold leading-relaxed px-4 uppercase tracking-widest text-[9px] text-center">VEÍCULOS SÃO PROIBIDOS. <br /> GPS E SENSORES ATIVOS.</p>
                            <button onClick={() => { setIsAntiTrapVisible(false); setSelectedTerritory(null); }} className="w-full bg-white text-black font-display font-black text-xl py-6 rounded-3xl hover:bg-neon-yellow transition-all shadow-2xl uppercase tracking-widest">ESTOU CIENTE</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
