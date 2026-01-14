import { Permissions } from '@data/enums/permissions';

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  route: string;
  permission?: Permissions;
}
