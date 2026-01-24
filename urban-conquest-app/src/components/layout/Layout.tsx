import { Home, Map as MapIcon, Trophy, User, Radio } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
    const { t } = useTranslation();

    const navItems = [
        { id: 'hub', icon: Home, label: t('hub') },
        { id: 'feed', icon: Radio, label: t('feed') },
        { id: 'map', icon: MapIcon, label: t('map') },
        { id: 'rank', icon: Trophy, label: t('rank') },
        { id: 'profile', icon: User, label: t('profile') },
    ];

    return (
        <div className="h-screen w-full bg-cyber-black text-white flex flex-col font-body antialiased overflow-hidden">
            {/* status bar spacer */}
            {/* status bar spacer */}
            <div className="h-safe-top bg-black/20 backdrop-blur-sm fixed top-0 w-full z-50"></div>

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 w-full relative",
                activeTab === 'map' ? "overflow-hidden" : "overflow-y-auto custom-scrollbar pb-24"
            )}>
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-border-grey pb-safe-bottom z-50">
                <div className="flex justify-around items-center h-20">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-all duration-300",
                                activeTab === item.id
                                    ? "text-neon-yellow drop-shadow-[0_0_8px_rgba(230,255,43,0.8)]"
                                    : "text-tech-grey hover:text-white"
                            )}
                        >
                            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
