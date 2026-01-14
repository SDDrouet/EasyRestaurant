import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '@core/configs/paths';
import { AuthService } from '@core/service/auth-service';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const msg = inject(MessageService);
  const router = inject(Router);

  // 1. Evitar interceptar peticiones de AUTH (Login/Refresh) para no entrar en bucle
  const isAuthUrl = req.url.includes('/auth/') && !req.url.includes('/auth/me');  
  
  const token = authService.getAccessToken();

  // 2. Agregar el token si existe y no es una ruta pública
  if (!isAuthUrl && token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 3. Manejar la petición
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error no es 401 o es una petición de auth, lanzamos el error directo
      if (error.status !== 401 || isAuthUrl) {
        return throwError(() => error);
      }

      // 4. Lógica de Refresh Token con switchMap
      // switchMap "espera" a que el refresh termine y devuelve un NUEVO observable
      return authService.refreshToken().pipe(
        switchMap(() => {
          // Clonamos la petición ORIGINAL con el NUEVO token
          const accessToken = authService.getAccessToken();
          const newAuthReq = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` }
          });

          return next(newAuthReq);
        }),
        catchError((err) => {          
          authService.clearSession();
          msg.add({ severity: 'warn', summary: 'Sesión expirada', detail: 'Por favor, inicia sesión de nuevo.' });
          router.navigate(['/' + PATHS.LOGIN]);
          return EMPTY;
        })
      )
    })
  );
};
