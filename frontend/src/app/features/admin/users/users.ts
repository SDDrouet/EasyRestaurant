import { Component, inject, OnInit, signal } from '@angular/core';
import { ContentLayout } from '@layout/content-layout/content-layout';
import { UserService } from '@core/service/user-service';
import { User } from '@data/interfaces/user-interface';
import { Pageable } from '@data/interfaces/pageable-interface';
import { DataTable, TableConfig, TableLazyLoadParams } from '@shared/components/data-table/data-table';

@Component({
  selector: 'app-users',
  imports: [ContentLayout, DataTable],
  templateUrl: './users.html',
})
export class Users {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

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
        console.error('Error loading users:', error);
        this.loading.set(false);
      },
    });
  }

  toggleUserStatus(user: User): void {
    this.userService.changeUserStatus(user.id).subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
        );
      },
      error: (error) => {
        console.error('Error changing user status:', error);
      },
    });
  }

  editUser(user: User): void {
    // TODO: Implementar edición de usuario
    console.log('Edit user:', user);
  }

  viewUser(user: User): void {
    // TODO: Implementar vista de detalles del usuario
    console.log('View user:', user);
  }
}
