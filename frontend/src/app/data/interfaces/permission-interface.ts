export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export interface PermissionRequest {
  name: string;
  resource: string;
  action: string;
}