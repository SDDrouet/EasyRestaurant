import { PATHS } from "@core/configs/paths";
import { AuthService } from "@core/service/auth-service";
import { Permissions } from "@data/enums/permissions";
import { MenuItem } from "primeng/api";

export const getAdminNav = (authService: AuthService): MenuItem[] => [
    {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: ['/', PATHS.ADMIN.BASE, PATHS.ADMIN.USERS],
        visible: authService.hasPermission(Permissions.READ_ANY_USER),
    },
    {
        label: 'Roles',
        icon: 'pi pi-shield',
        routerLink: ['/', PATHS.ADMIN.BASE, PATHS.ADMIN.ROLES],
        visible: authService.hasPermission(Permissions.MANAGE_PERMISSIONS),
    },
    {
        label: 'Permisos',
        icon: 'pi pi-list-check',
        routerLink: ['/', PATHS.ADMIN.BASE, PATHS.ADMIN.PERMISSIONS],
        visible: authService.hasPermission(Permissions.MANAGE_PERMISSIONS),
    }
];