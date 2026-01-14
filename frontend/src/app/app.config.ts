import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './routes/app.routes';
import { providePrimeNG } from 'primeng/config';
import ThemePresent from '../themePresent';
import { es } from "@core/configs/es.json"
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@core/interceptors/auth-interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        MessageService,
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
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
