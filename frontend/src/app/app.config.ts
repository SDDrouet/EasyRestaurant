import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import ThemePresent from '../themePresent';
import { es } from "../configs/es.json"

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        providePrimeNG({
            translation: es,
            theme: {
                preset: ThemePresent,
                options: {
                    darkModeSelector: '.my-app-dark',
                    cssLayer: {
                        name: 'primeng',
                        order: 'theme, base, primeng' // Esto es crucial para la especificidad
                    }
                },
            }
        })
    ]
};
