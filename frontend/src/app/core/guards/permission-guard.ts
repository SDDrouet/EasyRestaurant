import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/service/auth-service';
import { Permissions } from '@data/enums/permissions';
import { PATHS } from '@core/configs/paths';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as Permissions;

  if (!requiredPermission) {
    return true;
  }

  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  return router.createUrlTree([PATHS.NOT_AUTHORIZED]);
};
