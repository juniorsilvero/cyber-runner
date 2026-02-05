import { Zap, Timer, Flame, MapPin, Activity, Share2, Loader2 } from "lucide-react";
import { CircularProgress } from "../components/ui/CircularProgress";
import { StatCard } from "../components/ui/StatCard";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { RunningSession } from './RunningSession';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import type { Activity as RunActivity } from '../services/activityService';
import { getUserRuns, saveRun } from '../services/activityService';
import { supabase } from '../lib/supabase';

export function Dashboard() {
    const { t } = useTranslation();
    const [showRunningSession, setShowRunningSession] = useState(false);
    const [activities, setActivities] = useState<RunActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<RunActivity | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Get user ID and load activities from Supabase
    useEffect(() => {
        const loadActivities = async () => {
            setIsLoading(true);

            // Get current user
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);

                // Fetch activities from Supabase
                const { data } = await getUserRuns(session.user.id, 50);
                setActivities(data);
            }

            setIsLoading(false);
        };

        loadActivities();
    }, []);

    // Save activity to Supabase
    const handleFinishActivity = async (activity: any) => {
        if (!userId) {
            setShowRunningSession(false);
            return;
        }

        // Save to Supabase
        const { data: savedRun, error } = await saveRun(userId, {
            type: 'free',
            distance: activity.distance,
            duration: activity.duration,
            pace: activity.pace,
            route: activity.route,
            name: activity.name
        });

        if (!error && savedRun) {
            // Add to local state
            const newActivity: RunActivity = {
                id: savedRun.id,
                user_id: userId,
                type: 'free',
                distance_km: activity.distance,
                duration_seconds: activity.duration,
                pace: activity.pace,
                gps_path: activity.route,
                created_at: new Date().toISOString(),
                start_time: new Date(Date.now() - activity.duration * 1000).toISOString(),
                end_time: new Date().toISOString(),
                name: activity.name
            };
            setActivities(prev => [newActivity, ...prev]);
        }

        setShowRunningSession(false);
    };

    // Show running session
    if (showRunningSession) {
        return (
            <RunningSession
                onFinish={handleFinishActivity}
                onCancel={() => setShowRunningSession(false)}
                sessionType="hub"
            />
        );
    }

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    // Calculate real stats from activities
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayActivities = activities.filter(a => new Date(a.created_at).getTime() >= todayStart.getTime());
    const todayDistance = todayActivities.reduce((sum, a) => sum + a.distance_km, 0);
    const todayTime = todayActivities.reduce((sum, a) => sum + a.duration_seconds, 0);
    const todayCalories = Math.round(todayDistance * 60);
    const totalRC = activities.reduce((sum, a) => sum + Math.floor(a.distance_km * 20), 0);

    return (
        <div className="flex flex-col space-y-6 px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-center bg-surface-dark p-4 rounded-xl border border-border-grey shadow-lg">
                <div className="flex items-center space-x-2">
                    <Zap className="text-neon-yellow fill-neon-yellow" size={20} />
                    <span className="font-display font-bold text-lg tracking-wider text-white">CYBER RUN</span>
                </div>
                <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-neon-yellow font-mono text-xs font-bold">{totalRC} RC</span>
                </div>
            </div>

            {/* Main Stats */}
            <div className="bg-surface-dark rounded-[2rem] p-6 shadow-2xl border border-border-grey flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Activity size={120} />
                </div>
                <CircularProgress value={todayDistance > 0 ? Math.min((todayDistance / 10) * 100, 100) : 0} title={todayDistance.toFixed(1)} subtitle={t('dashboard.km_today')} />

                <div className="w-full mt-6">
                    <div className="flex justify-between text-xs font-bold text-tech-grey mb-2 uppercase tracking-wider">
                        <span>{t('dashboard.territory_secured')}</span>
                        <span>0%</span>
                    </div>
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-neon-yellow to-emerald-400 w-0 rounded-full shadow-[0_0_10px_rgba(230,255,43,0.3)]"></div>
                    </div>
                    <div className="text-right mt-1">
                        <span className="text-[10px] text-white/40">{t('dashboard.next_milestone')}</span>
                    </div>
                </div>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Timer} value={formatTime(todayTime) || "0m"} label={t('dashboard.active_time')} />
                <StatCard icon={Flame} value={todayCalories.toString()} label={t('dashboard.calories')} />
            </div>

            {/* Action Button */}
            <button
                onClick={() => setShowRunningSession(true)}
                className="w-full bg-neon-yellow text-black font-display font-bold text-xl py-5 rounded-2xl shadow-[0_0_20px_rgba(230,255,43,0.4)] hover:shadow-[0_0_30px_rgba(230,255,43,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
                <Activity size={24} strokeWidth={2.5} />
                <span>{t('dashboard.start_mission')}</span>
            </button>

            {/* Recent Activity */}
            <div className="pb-24">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-display font-bold text-white text-lg border-l-4 border-neon-yellow pl-3">{t('dashboard.recent_activity')}</h3>
                    <span className="text-[10px] font-bold text-tech-grey hover:text-white cursor-pointer transition-colors">{t('dashboard.view_all')}</span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-neon-yellow" size={32} />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-12">
                        <Activity size={48} className="mx-auto text-tech-grey mb-3" />
                        <p className="text-tech-grey text-sm">Nenhuma atividade ainda</p>
                        <p className="text-white/40 text-xs mt-1">Inicie sua primeira missão!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activities.slice(0, 5).map((activity) => (
                            <div
                                key={activity.id}
                                className="bg-surface-dark border border-border-grey p-4 rounded-xl flex items-center justify-between group hover:border-white/30 transition-colors cursor-pointer"
                                onClick={() => setSelectedActivity(activity)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/5 p-3 rounded-lg text-white group-hover:bg-neon-yellow group-hover:text-black transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm tracking-wide">
                                            {activity.distance_km.toFixed(2)} km
                                        </h4>
                                        <div className="flex items-center space-x-2 text-[10px] text-tech-grey mt-1 uppercase font-bold">
                                            <span className="bg-white/5 px-1.5 py-0.5 rounded text-white">
                                                {activity.type === 'ranked' ? 'RANKED' : activity.type === 'phase' ? 'FASE' : 'LIVRE'}
                                            </span>
                                            <span>{formatTime(activity.duration_seconds)}</span>
                                            <span>•</span>
                                            <span>{activity.pace}/km</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className="font-bold text-xs text-neon-yellow">
                                        +{Math.floor(activity.distance_km * 20)} RC
                                    </span>
                                    <Share2 size={14} className="text-tech-grey" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Detail Modal */}
            {selectedActivity && userId && (
                <ActivityDetailModal
                    activity={selectedActivity}
                    userId={userId}
                    onClose={() => setSelectedActivity(null)}
                />
            )}
        </div>
    );
}
