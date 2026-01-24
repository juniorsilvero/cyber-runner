import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from '../locales/pt-br.json';
import enUS from '../locales/en-us.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            'pt-BR': {
                translation: ptBR,
            },
            'en-US': {
                translation: enUS,
            },
        },
        lng: 'pt-BR', // Default language
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false, // React already safe from xss
        },
    });

export default i18n;
