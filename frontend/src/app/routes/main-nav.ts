import { PATHS } from "@core/configs/paths";
import { MenuItem } from "primeng/api";

export const MAIN_NAV: MenuItem[] = [
    {
        label: 'Principal',
        icon: 'pi pi-home',
        routerLink: '/' + PATHS.HOME,
    },
    {
        label: 'Administración',
        icon: 'pi pi-cog',
        items: [
            {
                label: 'Roles',
                icon: 'pi pi-shield',
                routerLink: '/' + PATHS.ADMIN.ROLES,
            },
            {
                label: 'permisos',
                icon: 'pi pi-list-check',
                routerLink: '/' + PATHS.ADMIN.PERMISSIONS,
            },
            {
                label: 'Usuarios',
                icon: 'pi pi-users',
            },

        ]
    }
];