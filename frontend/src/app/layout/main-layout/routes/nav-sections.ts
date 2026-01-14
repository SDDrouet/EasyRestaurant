import { PATHS } from '@core/configs/paths';
import { Permissions } from '@data/enums/permissions';
import { NavSection } from '@data/interfaces/navigation-interface';

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'home',
    label: 'Principal',
    icon: 'pi pi-home',
    route: '/' + PATHS.HOME,
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: 'pi pi-cog',
    route: '/' + PATHS.ADMIN.BASE,
    permission: Permissions.MANAGE_PERMISSIONS,
  },
];
