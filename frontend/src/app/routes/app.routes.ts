import { Routes } from '@angular/router';
import { Login } from '@features/login/login';
import { NotFound } from '@features/not-found/not-found';
import { Home } from '@features/home/home';
import { PATHS } from '@core/configs/paths';
import { authGuard } from '@core/guards/auth-guard';
import { authLoginGuard } from '@core/guards/auth-login-guard';
import { Roles } from '@features/admin/roles/roles';
import { Permissions } from '@features/admin/permissions/permissions';
import { MainLayout } from '@layout/main-layout/main-layout';

export const routes: Routes = [
    { path: PATHS.LOGIN, component: Login, canActivate: [authLoginGuard] },

    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: PATHS.HOME, component: Home },
            { path: '', redirectTo: PATHS.HOME, pathMatch: 'full' },
            { path: PATHS.ADMIN.ROLES, component: Roles },
            { path: PATHS.ADMIN.PERMISSIONS, component: Permissions },
        ],
    },

    { path: PATHS.NOT_FOUND, component: NotFound },
];
