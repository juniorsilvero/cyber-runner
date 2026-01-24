import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, MapPin, User } from 'lucide-react';

export function Settings() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex flex-col space-y-6 px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center space-x-3 bg-deep-petrol p-4 rounded-xl border border-white/5 shadow-lg">
                <SettingsIcon className="text-neon-yellow" size={24} />
                <span className="font-display font-bold text-lg tracking-wider text-white">
                    {t('settings.title')}
                </span>
            </div>

            {/* Language Selector */}
            <div className="bg-surface-dark border border-white/5 p-6 rounded-[2rem]">
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

            {/* Profile Preview (Decorational) */}
            <div className="opacity-50 pointer-events-none mt-8 space-y-4">
                <div className="bg-surface-dark p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User size={20} className="text-tech-grey" />
                        <span className="text-tech-grey font-bold">Account</span>
                    </div>
                </div>
                <div className="bg-surface-dark p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-tech-grey" />
                        <span className="text-tech-grey font-bold">Privacy Zones</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
