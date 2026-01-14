import { Routes } from '@angular/router';
import { Login } from '@features/login/login';
import { NotFound } from '@features/not-found/not-found';
import { Home } from '@features/home/home';
import { PATHS } from '@core/configs/paths';
import { authGuard } from '@core/guards/auth-guard';
import { authLoginGuard } from '@core/guards/auth-login-guard';
import { permissionGuard } from '@core/guards/permission-guard';
import { Roles } from '@features/admin/roles/roles';
import { Permissions } from '@features/admin/permissions/permissions';
import { Users } from '@features/admin/users/users';
import { Admin } from '@features/admin/admin';
import { MainLayout } from '@layout/main-layout/main-layout';
import { NotAuthorized } from '@features/not-authorized/not-authorized';
import { Permissions as PermissionsEnum } from '@data/enums/permissions';

export const routes: Routes = [
    { path: PATHS.LOGIN, component: Login, canActivate: [authLoginGuard] },

    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: PATHS.HOME, component: Home },
            { path: '', redirectTo: PATHS.HOME, pathMatch: 'full' },
            
            // Sección de Administración
            {
                path: PATHS.ADMIN.BASE,
                component: Admin,
                canActivate: [permissionGuard],
                data: { permission: PermissionsEnum.MANAGE_PERMISSIONS },
                children: [
                    { 
                        path: PATHS.ADMIN.USERS, 
                        component: Users,
                    },
                    { 
                        path: PATHS.ADMIN.ROLES, 
                        component: Roles,
                    },
                    { 
                        path: PATHS.ADMIN.PERMISSIONS, 
                        component: Permissions,
                    },
                    { path: '', redirectTo: PATHS.ADMIN.USERS, pathMatch: 'full' },
                ],
            },
        ],
    },

    { path: PATHS.NOT_AUTHORIZED, component: NotAuthorized },
    { path: PATHS.NOT_FOUND, component: NotFound },
];
