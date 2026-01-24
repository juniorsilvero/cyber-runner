import { Zap, Timer, Flame, MapPin, Activity, Share2 } from "lucide-react";
import { CircularProgress } from "../components/ui/CircularProgress";
import { StatCard } from "../components/ui/StatCard";
import { cn } from "../lib/utils";
import { useTranslation } from 'react-i18next';

export function Dashboard() {
    const { t } = useTranslation();

    const recentActivities = [
        { id: 1, title: t('activities.neon_sprint'), type: t('activities.run'), time: "24 mins", dist: "5.2km", points: "+50 RC", color: "text-neon-yellow" },
        { id: 2, title: t('activities.sector_patrol'), type: t('activities.patrol'), time: "42 mins", dist: "5.8km", points: "+120 RC", color: "text-emerald-400" },
        { id: 3, title: t('activities.night_ops'), type: t('activities.hike'), time: "1h 12m", dist: "8.4km", points: "+200 RC", color: "text-purple-400" },
    ];

    return (
        <div className="flex flex-col space-y-6 px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-center bg-surface-dark p-4 rounded-xl border border-border-grey shadow-lg">
                <div className="flex items-center space-x-2">
                    <Zap className="text-neon-yellow fill-neon-yellow" size={20} />
                    <span className="font-display font-bold text-lg tracking-wider text-white">CYBER RUNNER</span>
                </div>
                <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-neon-yellow font-mono text-xs font-bold">1,250 RC</span>
                </div>
            </div>

            {/* Main Stats */}
            <div className="bg-surface-dark rounded-[2rem] p-6 shadow-2xl border border-border-grey flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Activity size={120} />
                </div>
                <CircularProgress value={65} title="5.2" subtitle={t('dashboard.km_today')} />

                <div className="w-full mt-6">
                    <div className="flex justify-between text-xs font-bold text-tech-grey mb-2 uppercase tracking-wider">
                        <span>{t('dashboard.territory_secured')}</span>
                        <span>12%</span>
                    </div>
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-neon-yellow to-emerald-400 w-[12%] rounded-full shadow-[0_0_10px_rgba(230,255,43,0.3)]"></div>
                    </div>
                    <div className="text-right mt-1">
                        <span className="text-[10px] text-white/40">{t('dashboard.next_milestone')}</span>
                    </div>
                </div>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Timer} value="42:10" label={t('dashboard.active_time')} />
                <StatCard icon={Flame} value="340" label={t('dashboard.calories')} />
            </div>

            {/* Action Button */}
            {/* Action Button */}
            <button className="w-full bg-neon-yellow text-black font-display font-bold text-xl py-5 rounded-2xl shadow-[0_0_20px_rgba(230,255,43,0.4)] hover:shadow-[0_0_30px_rgba(230,255,43,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 active:scale-95">
                <Activity size={24} strokeWidth={2.5} />
                <span>{t('dashboard.start_mission')}</span>
            </button>

            {/* Recent Activity */}
            <div className="pb-4">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-display font-bold text-white text-lg border-l-4 border-neon-yellow pl-3">{t('dashboard.recent_activity')}</h3>
                    <span className="text-[10px] font-bold text-tech-grey hover:text-white cursor-pointer transition-colors">{t('dashboard.view_all')}</span>
                </div>

                <div className="space-y-3">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="bg-surface-dark border border-border-grey p-4 rounded-xl flex items-center justify-between group hover:border-white/30 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/5 p-3 rounded-lg text-white group-hover:bg-neon-yellow group-hover:text-black transition-colors">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm tracking-wide">{activity.title}</h4>
                                    <div className="flex items-center space-x-2 text-[10px] text-tech-grey mt-1 uppercase font-bold">
                                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-white">{activity.type}</span>
                                        <span>{activity.time}</span>
                                        <span>•</span>
                                        <span>{activity.dist}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className={cn("font-bold text-xs", activity.color)}>{activity.points}</span>
                                <button
                                    className="text-tech-grey hover:text-neon-yellow transition-colors p-1"
                                    title={t('feed_page.title')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Mock post action
                                        alert("Posted to FEED!");
                                    }}
                                >
                                    <Share2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
