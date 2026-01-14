import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/service/auth-service';
import { catchError, map, of } from 'rxjs';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.refreshToken().pipe(
    map(() => {
      return router.createUrlTree(['/']);
    }),
    catchError(() => {
      return of(true);
    })
  );
};
