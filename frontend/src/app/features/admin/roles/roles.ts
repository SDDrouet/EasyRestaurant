import { Component, inject, signal, ViewChild } from '@angular/core';
import { ContentLayout } from '@layout/content-layout/content-layout';
import { RoleService } from '@core/service/role-service';
import { PermissionService } from '@core/service/permission-service';
import { UserService } from '@core/service/user-service';
import { Role, RoleRequest, AssignPermissionsDTO, AssignRoleDTO } from '@data/interfaces/role-interface';
import { Permission } from '@data/interfaces/permission-interface';
import { User } from '@data/interfaces/user-interface';
import { Pageable } from '@data/interfaces/pageable-interface';
import { DataTable, TableConfig, TableLazyLoadParams } from '@shared/components/data-table/data-table';
import { SHARED_UI_MODULES } from '@shared/ui-modules';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ViewRoleDialog } from './components/view-role-dialog';
import { EditRoleDialog } from './components/edit-role-dialog';
import { CreateRoleDialog } from './components/create-role-dialog';
import { AssignPermissionsDialog } from './components/assign-permissions-dialog';
import { AssignRoleToUserDialog } from './components/assign-role-to-user-dialog';


@Component({
  selector: 'app-roles',
  imports: [ContentLayout, DataTable, SHARED_UI_MODULES, ViewRoleDialog, EditRoleDialog, CreateRoleDialog, AssignPermissionsDialog, AssignRoleToUserDialog],
  templateUrl: './roles.html',
})
export class Roles {
  private roleService = inject(RoleService);
  private permissionService = inject(PermissionService);
  private userService = inject(UserService);
  private msg = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild(CreateRoleDialog) createRoleDialog!: CreateRoleDialog;

  roles = signal<Role[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  // Modals
  viewDialogVisible = signal<boolean>(false);
  editDialogVisible = signal<boolean>(false);
  createDialogVisible = signal<boolean>(false);
  assignPermissionsDialogVisible = signal<boolean>(false);
  assignRoleToUserDialogVisible = signal<boolean>(false);

  // Selected role
  selectedRole = signal<Role | null>(null);

  tableConfig = signal<TableConfig<Role>>({
    columns: [
      {
        field: 'id',
        header: 'ID',
        width: '70px',
      },
      {
        field: 'name',
        header: 'Nombre',
        filterable: true,
        width: '200px',
      },
      {
        field: 'description',
        header: 'Descripción',
        width: '250px',
      },
      {
        field: 'permissions',
        header: 'Permisos',
        type: 'custom',
        customTemplate: (role) => role.permissions.map(p => p.name).join(', '),
        width: '300px',
      },
    ],
    actions: [
      {
        icon: 'pi-eye',
        tooltip: 'Ver detalles',
        color: 'blue',
        onClick: (role) => this.viewRole(role),
      },
      {
        icon: 'pi-pencil',
        tooltip: 'Editar',
        color: 'amber',
        onClick: (role) => this.editRole(role),
      },
      {
        icon: 'pi-key',
        tooltip: 'Asignar Permisos',
        color: 'green',
        onClick: (role) => this.assignPermissions(role),
      },
      {
        icon: 'pi-user-plus',
        tooltip: 'Asignar a Usuario',
        color: 'blue',
        onClick: (role) => this.assignRoleToUser(role),
      },
      {
        icon: 'pi-trash',
        tooltip: 'Eliminar',
        color: 'red',
        onClick: (role) => this.deleteRole(role),
      },
    ],
  });

  onLazyLoad(params: TableLazyLoadParams): void {
    this.loading.set(true);

    const pageableParams = {
      page: params.page,
      size: params.size,
      sort: params.sort,
      direction: params.direction,
    };

    const filters = {
      name: params.filters?.['name'] || undefined,
    };

    this.roleService.findAll(pageableParams).subscribe({
      next: (response) => {
        const pageableData = response.data as Pageable<Role>;
        this.roles.set(pageableData.content);
        this.totalRecords.set(pageableData.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.loading.set(false);
      },
    });
  }

  deleteRole(role: Role): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el rol "${role.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.delete(role.id).subscribe({
          next: () => {
            this.roles.update((roles) =>
              roles.filter((r) => r.id !== role.id)
            );
            this.totalRecords.update((total) => total - 1);
            this.msg.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Rol eliminado correctamente'
            });
          },
          error: (error) => {
            this.msg.add({
              severity: 'error',
              summary: 'Error',
              detail: error
            });
          },
        });
      },
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined',
    });
  }

  viewRole(role: Role): void {
    this.selectedRole.set(role);
    this.viewDialogVisible.set(true);
  }

  editRole(role: Role): void {
    this.selectedRole.set(role);
    this.editDialogVisible.set(true);
  }

  createRole(): void {
    this.createRoleDialog.resetForm();
    this.createDialogVisible.set(true);
  }

  assignPermissions(role: Role): void {
    this.selectedRole.set(role);
    this.assignPermissionsDialogVisible.set(true);
  }

  assignRoleToUser(role: Role): void {
    this.selectedRole.set(role);
    this.assignRoleToUserDialogVisible.set(true);
  }

  saveEditRole(updateData: { id: number; data: RoleRequest }): void {
    this.roleService.update(updateData.id, updateData.data).subscribe({
      next: (response) => {
        const updatedRole = response.data;
        this.roles.update((roles) =>
          roles.map((r) => (r.id === updatedRole.id ? updatedRole : r))
        );
        this.editDialogVisible.set(false);
        this.selectedRole.set(null);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol actualizado correctamente'
        });
      },
      error: (error) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      },
    });
  }

  saveCreateRole(roleData: RoleRequest): void {
    this.roleService.create(roleData).subscribe({
      next: (response) => {
        const newRole = response.data;
        this.roles.update((roles) => [newRole, ...roles]);
        this.totalRecords.update((total) => total + 1);
        this.createDialogVisible.set(false);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol creado correctamente'
        });
      },
      error: (error) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      },
    });
  }

  saveAssignPermissions(assignData: AssignPermissionsDTO): void {
    this.roleService.assignPermissions(assignData).subscribe({
      next: (response) => {
        const updatedRole = response.data;
        this.roles.update((roles) =>
          roles.map((r) => (r.id === updatedRole.id ? updatedRole : r))
        );
        this.assignPermissionsDialogVisible.set(false);
        this.selectedRole.set(null);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permisos asignados correctamente'
        });
      },
      error: (error) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      },
    });
  }

  saveAssignRoleToUser(assignData: AssignRoleDTO): void {
    this.roleService.assignToUser(assignData).subscribe({
      next: () => {
        this.assignRoleToUserDialogVisible.set(false);
        this.selectedRole.set(null);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol asignado al usuario correctamente'
        });
      },
      error: (error) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      },
    });
  }

  closeViewDialog(): void {
    this.viewDialogVisible.set(false);
    this.selectedRole.set(null);
  }

  closeEditDialog(): void {
    this.editDialogVisible.set(false);
    this.selectedRole.set(null);
  }

  closeCreateDialog(): void {
    this.createDialogVisible.set(false);
  }

  closeAssignPermissionsDialog(): void {
    this.assignPermissionsDialogVisible.set(false);
    this.selectedRole.set(null);
  }

  closeAssignRoleToUserDialog(): void {
    this.assignRoleToUserDialogVisible.set(false);
    this.selectedRole.set(null);
  }
}
