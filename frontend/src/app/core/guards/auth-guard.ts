import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { PATHS } from '@core/configs/paths';
import { AuthService } from '@core/service/auth-service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return authService.refreshToken().pipe(
    map(() => {
      return true; 
    }),
    catchError(() => {
      return of(router.createUrlTree([`/${PATHS.LOGIN}`]));
    })
  );  
};
