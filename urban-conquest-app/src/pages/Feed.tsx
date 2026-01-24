import { MapPin, Heart, MessageSquare, Share2, Bell } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function Feed() {
    const { t } = useTranslation();

    const feedItems = [
        {
            id: 1,
            user: "Sarah 'Viper' Connor",
            avatar: "bg-purple-500",
            action: t('feed.captured_zone'),
            target: "Sector 9 - Industrial District",
            time: "2h ago",
            stats: { dist: "8.5km", pace: "4:32/km", points: "+450 RC" },
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            user: "Kaelthas",
            avatar: "bg-neon-yellow",
            action: t('feed.completed_mission'),
            target: "Neon Sprint Challenge",
            time: "4h ago",
            stats: { dist: "5.0km", pace: "3:45/km", points: "+300 RC" },
            likes: 156,
            comments: 12
        },
        {
            id: 3,
            user: "Rogue_01",
            avatar: "bg-emerald-500",
            action: t('feed.lost_control'),
            target: "Central Plaza Zone",
            time: "5h ago",
            stats: null, // Just a notification type event
            likes: 8,
            comments: 2
        }
    ];

    return (
        <div className="flex flex-col space-y-6 px-4 pt-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="font-display font-bold text-2xl text-white tracking-wider">{t('feed_page.title')}</h2>
                <button className="bg-surface-dark p-2 rounded-full border border-white/10 hover:border-neon-yellow/50 transition-colors relative">
                    <Bell className="text-tech-grey hover:text-neon-yellow" size={20} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-neon-yellow rounded-full border-2 border-surface-dark"></span>
                </button>
            </div>

            <div className="space-y-4">
                {feedItems.map((item) => (
                    <div key={item.id} className="bg-surface-dark border border-white/5 rounded-2xl p-5 shadow-lg">
                        {/* User Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full ${item.avatar} flex items-center justify-center text-deep-petrol font-bold`}>
                                    {item.user.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{item.user}</h3>
                                    <p className="text-[10px] text-tech-grey uppercase tracking-wide">{item.time}</p>
                                </div>
                            </div>
                            {item.stats && (
                                <span className="text-neon-yellow font-bold text-xs">{item.stats.points}</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <p className="text-tech-grey text-sm">
                                <span className="text-white font-semibold">{item.action}</span>
                                <span className="mx-1">•</span>
                                <span className="text-neon-yellow">{item.target}</span>
                            </p>

                            {item.stats && (
                                <div className="mt-3 flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded text-xs text-white/80">
                                        <MapPin size={12} className="text-neon-yellow" />
                                        <span>{item.stats.dist}</span>
                                    </div>
                                    <div className="text-xs text-tech-grey">{item.stats.pace}</div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex space-x-6">
                                <button className="flex items-center space-x-1.5 text-tech-grey hover:text-red-400 transition-colors group">
                                    <Heart size={18} className="group-hover:fill-red-400" />
                                    <span className="text-xs font-bold">{item.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1.5 text-tech-grey hover:text-white transition-colors">
                                    <MessageSquare size={18} />
                                    <span className="text-xs font-bold">{item.comments}</span>
                                </button>
                            </div>
                            <button className="text-tech-grey hover:text-neon-yellow transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
