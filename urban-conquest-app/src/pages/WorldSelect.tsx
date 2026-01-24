import { Lock, ChevronRight, Globe } from "lucide-react";
import { cn } from "../lib/utils";

interface World {
    id: number;
    title: string;
    description: string;
    locked: boolean;
    image: string; // CSS color or image url
}

// Mock Data for 10 Worlds
const worlds: World[] = [
    { id: 1, title: "Neon Outskirts", description: "The journey begins.", locked: false, image: "from-deep-petrol to-cyber-black" },
    { id: 2, title: "Industrial Sector", description: "Heavy machinery zone.", locked: true, image: "from-amber-900 to-cyber-black" },
    { id: 3, title: "Cyber Downtown", description: "Bright lights, fast pace.", locked: true, image: "from-purple-900 to-cyber-black" },
    { id: 4, title: "Skyline Bridge", description: "High altitude training.", locked: true, image: "from-blue-900 to-cyber-black" },
    { id: 5, title: "Data Center", description: "Cool and calculated.", locked: true, image: "from-emerald-900 to-cyber-black" },
    { id: 6, title: "The Void", description: "Silence is your friend.", locked: true, image: "from-gray-800 to-cyber-black" },
    { id: 7, title: "Solar Array", description: "Burning calories.", locked: true, image: "from-orange-800 to-cyber-black" },
    { id: 8, title: "Toxic Wasteland", description: "Survival mode.", locked: true, image: "from-green-900 to-cyber-black" },
    { id: 9, title: "Crystal Peaks", description: "Thin air, hard breathing.", locked: true, image: "from-cyan-900 to-cyber-black" },
    { id: 10, title: "Citadel Core", description: "The final test.", locked: true, image: "from-red-950 to-cyber-black" },
];

interface WorldSelectProps {
    onSelectWorld: (worldId: number) => void;
}

export function WorldSelect({ onSelectWorld }: WorldSelectProps) {
    return (
        <div className="flex flex-col h-full bg-cyber-black animate-in fade-in duration-500">
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center space-x-3 mb-2">
                    <Globe className="text-neon-yellow" size={24} />
                    <h2 className="font-display font-bold text-2xl text-white tracking-wider uppercase">SELECT WORLD</h2>
                </div>
                <p className="text-tech-grey text-sm">Choose your conquest zone.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-24 space-y-4">
                {worlds.map((world) => (
                    <button
                        key={world.id}
                        disabled={world.locked}
                        onClick={() => !world.locked && onSelectWorld(world.id)}
                        className={cn(
                            "w-full relative overflow-hidden rounded-2xl p-6 text-left border transition-all duration-300 group shadow-lg",
                            world.locked
                                ? "bg-surface-dark border-white/5 opacity-70 cursor-not-allowed"
                                : "bg-surface-dark border-white/20 hover:border-neon-yellow shadow-lg hover:shadow-[0_0_15px_rgba(230,255,43,0.15)] active:scale-[0.98]"
                        )}
                    >
                        {/* Background Gradient */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity",
                            world.image,
                            !world.locked && "group-hover:opacity-30"
                        )} />

                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className={cn(
                                    "font-display font-bold text-lg mb-1 tracking-wide uppercase",
                                    world.locked ? "text-tech-grey" : "text-white"
                                )}>
                                    {world.id}. {world.title}
                                </h3>
                                <p className="text-[10px] text-tech-grey uppercase font-bold tracking-wider">
                                    {world.locked ? "LOCKED" : world.description}
                                </p>
                            </div>

                            <div className="bg-black/40 p-3 rounded-full border border-white/10">
                                {world.locked ? (
                                    <Lock size={18} className="text-tech-grey" />
                                ) : (
                                    <ChevronRight size={18} className="text-neon-yellow group-hover:translate-x-1 transition-transform" />
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
