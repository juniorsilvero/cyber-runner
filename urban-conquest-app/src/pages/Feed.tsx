import { MapPin, Heart, MessageSquare, Share2, Bell, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function Feed() {
    const { t } = useTranslation();

    // Empty feed - will be populated from Supabase
    const feedItems: Array<{
        id: string;
        user: string;
        avatar: string;
        action: string;
        target: string;
        time: string;
        stats: { dist: string; pace: string; points: string } | null;
        likes: number;
        comments: number;
    }> = [];

    return (
        <div className="flex flex-col space-y-6 px-4 pt-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="font-display font-bold text-2xl text-white tracking-wider">{t('feed_page.title')}</h2>
                <button className="bg-surface-dark p-2 rounded-full border border-white/10 hover:border-neon-yellow/50 transition-colors relative">
                    <Bell className="text-tech-grey hover:text-neon-yellow" size={20} />
                </button>
            </div>

            {feedItems.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="w-20 h-20 bg-surface-dark rounded-full flex items-center justify-center mb-6 border border-border-grey">
                        <Users className="text-tech-grey" size={36} />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-2">Nenhuma atividade ainda</h3>
                    <p className="text-tech-grey text-sm text-center max-w-xs">
                        Complete sua primeira corrida para ver suas atividades aqui e acompanhar seus amigos!
                    </p>
                </div>
            ) : (
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
            )}
        </div>
    );
}

