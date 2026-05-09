import { Permission } from './permission-interface';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface RoleRequest {
  name: string;
  description: string;
  permissionIds?: number[];
}

export interface AssignPermissionsDTO {
  roleId: number;
  permissionIds: number[];
}

export interface AssignRoleDTO {
  userId: number;
  roleIds: number[];
}