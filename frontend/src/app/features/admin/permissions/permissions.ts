import { Component, inject, signal, ViewChild } from '@angular/core';
import { ContentLayout } from '@layout/content-layout/content-layout';
import { PermissionService } from '@core/service/permission-service';
import { Permission, PermissionRequest } from '@data/interfaces/permission-interface';
import { Pageable } from '@data/interfaces/pageable-interface';
import { DataTable, TableConfig, TableLazyLoadParams } from '@shared/components/data-table/data-table';
import { SHARED_UI_MODULES } from '@shared/ui-modules';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ViewPermissionDialog } from './components/view-permission-dialog';
import { EditPermissionDialog } from './components/edit-permission-dialog';
import { CreatePermissionDialog } from './components/create-permission-dialog';


@Component({
  selector: 'app-permissions',
  imports: [ContentLayout, DataTable, SHARED_UI_MODULES, ViewPermissionDialog, EditPermissionDialog, CreatePermissionDialog],
  templateUrl: './permissions.html',
})
export class Permissions {
  private permissionService = inject(PermissionService);
  private msg = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild(CreatePermissionDialog) createPermissionDialog!: CreatePermissionDialog;

  permissions = signal<Permission[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  // Modals
  viewDialogVisible = signal<boolean>(false);
  editDialogVisible = signal<boolean>(false);
  createDialogVisible = signal<boolean>(false);

  // Selected permission
  selectedPermission = signal<Permission | null>(null);

  tableConfig = signal<TableConfig<Permission>>({
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
        field: 'resource',
        header: 'Recurso',
        width: '300px',
      },
      {
        field: 'action',
        header: 'Acción',
        width: '300px',
      },
    ],
    actions: [
      {
        icon: 'pi-eye',
        tooltip: 'Ver detalles',
        color: 'blue',
        onClick: (permission) => this.viewPermission(permission),
      },
      {
        icon: 'pi-pencil',
        tooltip: 'Editar',
        color: 'amber',
        onClick: (permission) => this.editPermission(permission),
      },
      {
        icon: 'pi-trash',
        tooltip: 'Eliminar',
        color: 'red',
        onClick: (permission) => this.deletePermission(permission),
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

    this.permissionService.findAll(pageableParams).subscribe({
      next: (response) => {
        const pageableData = response.data as Pageable<Permission>;
        this.permissions.set(pageableData.content);
        this.totalRecords.set(pageableData.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.loading.set(false);
      },
    });
  }

  deletePermission(permission: Permission): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el permiso "${permission.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.permissionService.delete(permission.id).subscribe({
          next: () => {
            this.permissions.update((permissions) =>
              permissions.filter((p) => p.id !== permission.id)
            );
            this.totalRecords.update((total) => total - 1);
            this.msg.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Permiso eliminado correctamente'
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

  viewPermission(permission: Permission): void {
    this.selectedPermission.set(permission);
    this.viewDialogVisible.set(true);
  }

  editPermission(permission: Permission): void {
    this.selectedPermission.set(permission);
    this.editDialogVisible.set(true);
  }

  createPermission(): void {
    this.createPermissionDialog.resetForm();
    this.createDialogVisible.set(true);
  }

  saveEditPermission(updateData: { id: number; data: PermissionRequest }): void {
    this.permissionService.update(updateData.id, updateData.data).subscribe({
      next: (response) => {
        const updatedPermission = response.data;
        this.permissions.update((permissions) =>
          permissions.map((p) => (p.id === updatedPermission.id ? updatedPermission : p))
        );
        this.editDialogVisible.set(false);
        this.selectedPermission.set(null);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permiso actualizado correctamente'
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

  saveCreatePermission(permissionData: PermissionRequest): void {
    this.permissionService.create(permissionData).subscribe({
      next: (response) => {
        const newPermission = response.data;
        this.permissions.update((permissions) => [newPermission, ...permissions]);
        this.totalRecords.update((total) => total + 1);
        this.createDialogVisible.set(false);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permiso creado correctamente'
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
    this.selectedPermission.set(null);
  }

  closeEditDialog(): void {
    this.editDialogVisible.set(false);
    this.selectedPermission.set(null);
  }

  closeCreateDialog(): void {
    this.createDialogVisible.set(false);
  }
}
