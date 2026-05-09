import { Component, inject, signal, ViewChild } from '@angular/core';
import { ContentLayout } from '@layout/content-layout/content-layout';
import { UserService } from '@core/service/user-service';
import { User, RegisterUser } from '@data/interfaces/user-interface';
import { Pageable } from '@data/interfaces/pageable-interface';
import { DataTable, TableConfig, TableLazyLoadParams } from '@shared/components/data-table/data-table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ViewUserDialog } from './components/view-user-dialog';
import { EditUserDialog } from './components/edit-user-dialog';
import { CreateUserDialog } from './components/create-user-dialog';

@Component({
  selector: 'app-users',
  imports: [
    ContentLayout,
    DataTable,
    ButtonModule,
    ViewUserDialog,
    EditUserDialog,
    CreateUserDialog
  ],
  templateUrl: './users.html',
})
export class Users {
  private userService = inject(UserService);
  private msg = inject(MessageService);

  @ViewChild(CreateUserDialog) createUserDialog!: CreateUserDialog;

  users = signal<User[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  // Modals
  viewDialogVisible = signal<boolean>(false);
  editDialogVisible = signal<boolean>(false);
  createDialogVisible = signal<boolean>(false);

  // Selected user
  selectedUser = signal<User | null>(null);

  tableConfig = signal<TableConfig<User>>({
    columns: [
      {
        field: 'id',
        header: 'ID',
        width: '70px',
      },
      {
        field: 'username',
        header: 'Usuario',
        filterable: true,
        width: '200px',
      },
      {
        field: 'email',
        header: 'Email',
        width: '250px',
        filterable: true,
      },
      {
        field: 'fullname',
        header: 'Nombre',
        type: 'custom',
        customTemplate: (user) => `${user.firstName} ${user.lastName}`,
        filterable: true,
      },
      {
        field: 'isActive',
        header: 'Estado',
        width: '90px',
        type: 'badge',
        badgeConfig: {
          getValue: (user) => user.isActive,
          trueValue: {
            label: 'Activo',
            class: 'bg-green-100 text-green-800',
            icon: 'pi-check',
          },
          falseValue: {
            label: 'Inactivo',
            class: 'bg-red-100 text-red-800',
            icon: 'pi-times',
          },
        },
      },
    ],
    actions: [
      {
        icon: 'pi-eye',
        tooltip: 'Ver detalles',
        color: 'blue',
        onClick: (user) => this.viewUser(user),
      },
      {
        icon: 'pi-pencil',
        tooltip: 'Editar',
        color: 'amber',
        onClick: (user) => this.editUser(user),
      },
      {
        icon: 'pi-ban',
        tooltip: 'Desactivar',
        color: 'red',
        onClick: (user) => this.toggleUserStatus(user),
        condition: (user) => user.isActive,
        alternativeAction: {
          icon: 'pi-check-circle',
          tooltip: 'Activar',
          color: 'green',
          onClick: (user) => this.toggleUserStatus(user),
        },
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
      username: params.filters?.['username'] || undefined,
      email: params.filters?.['email'] || undefined,
      fullName: params.filters?.['fullname'] || undefined,
    };

    this.userService.getAllUsers(pageableParams, filters).subscribe({
      next: (response) => {
        const pageableData = response.data as Pageable<User>;
        this.users.set(pageableData.content);
        this.totalRecords.set(pageableData.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
      },
    });
  }

  toggleUserStatus(user: User): void {
    this.userService.changeUserStatus(user.id).subscribe({
      next: (response) => {
        this.users.update((users) =>
          users.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
        );
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message
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

  viewUser(user: User): void {
    this.selectedUser.set(user);
    this.viewDialogVisible.set(true);
  }

  editUser(user: User): void {
    this.selectedUser.set(user);
    this.editDialogVisible.set(true);
  }

  createUser(): void {
    this.createUserDialog.resetForm();
    this.createDialogVisible.set(true);
  }

  saveEditUser(updateData: Partial<User>): void {
    this.userService.updateUser(updateData).subscribe({
      next: (response) => {
        const updatedUser = response.data;
        this.users.update((users) =>
          users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        this.editDialogVisible.set(false);
        this.selectedUser.set(null);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message
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

  saveCreateUser(userData: RegisterUser): void {
    this.userService.registerUser(userData).subscribe({
      next: (response) => {
        const newUser = response.data;
        this.users.update((users) => [newUser, ...users]);
        this.totalRecords.update((total) => total + 1);
        this.createDialogVisible.set(false);
        this.msg.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message
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
    this.selectedUser.set(null);
  }

  closeEditDialog(): void {
    this.editDialogVisible.set(false);
    this.selectedUser.set(null);
  }

  closeCreateDialog(): void {
    this.createDialogVisible.set(false);
  }
}
