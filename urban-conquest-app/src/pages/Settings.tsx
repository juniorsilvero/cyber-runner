import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, MapPin, User, LogOut, ChevronRight } from 'lucide-react';

interface SettingsProps {
    onLogout?: () => void;
    user?: { id: string; email: string; name: string } | null;
}

export function Settings({ onLogout, user }: SettingsProps) {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex flex-col space-y-6 px-6 pt-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center space-x-3 bg-deep-petrol p-4 rounded-xl border border-white/5 shadow-lg">
                <SettingsIcon className="text-neon-yellow" size={24} />
                <span className="font-display font-bold text-lg tracking-wider text-white">
                    {t('settings.title')}
                </span>
            </div>

            {/* User Profile Card */}
            {user && (
                <div className="bg-gradient-to-r from-surface-dark to-deep-petrol border border-white/10 p-5 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-neon-yellow to-yellow-500 rounded-xl flex items-center justify-center text-xl font-black text-deep-petrol shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-lg truncate">{user.name}</h3>
                            <p className="text-tech-grey text-sm truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Selector */}
            <div className="bg-surface-dark border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                    <Globe className="text-tech-grey" size={20} />
                    <h3 className="font-bold text-white tracking-wide">{t('settings.language')}</h3>
                </div>

                <p className="text-sm text-tech-grey mb-6">
                    {t('settings.select_language')}
                </p>

                <div className="flex space-x-4">
                    <button
                        onClick={() => changeLanguage('pt-BR')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all ${i18n.language === 'pt-BR'
                            ? 'bg-neon-yellow text-deep-petrol shadow-[0_0_15px_rgba(230,255,43,0.3)]'
                            : 'bg-black/40 text-tech-grey hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        Português
                    </button>
                    <button
                        onClick={() => changeLanguage('en-US')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all ${i18n.language === 'en-US'
                            ? 'bg-neon-yellow text-deep-petrol shadow-[0_0_15px_rgba(230,255,43,0.3)]'
                            : 'bg-black/40 text-tech-grey hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        English
                    </button>
                </div>
            </div>

            {/* Account Options */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
                <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <User size={20} className="text-tech-grey" />
                        <span className="text-white font-bold">Editar Perfil</span>
                    </div>
                    <ChevronRight size={18} className="text-tech-grey" />
                </button>
                <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-tech-grey" />
                        <span className="text-white font-bold">Zonas de Privacidade</span>
                    </div>
                    <ChevronRight size={18} className="text-tech-grey" />
                </button>
            </div>

            {/* Logout Button */}
            {onLogout && (
                <button
                    onClick={onLogout}
                    className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-red-500/20 transition-colors"
                >
                    <LogOut size={20} />
                    Sair da Conta
                </button>
            )}

            {/* App Version */}
            <div className="text-center pt-4">
                <p className="text-tech-grey/50 text-xs">CyberRun v1.0.0</p>
            </div>
        </div>
    );
}
