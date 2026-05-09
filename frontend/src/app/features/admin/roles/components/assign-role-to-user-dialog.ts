import { Component, output, model, inject, input, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UserService } from '@core/service/user-service';
import { Role, AssignRoleDTO } from '@data/interfaces/role-interface';
import { User } from '@data/interfaces/user-interface';
import { PageableParams } from '@data/interfaces/pageable-interface';

@Component({
  selector: 'app-assign-role-to-user-dialog',
  imports: [DialogModule, ButtonModule, AutoCompleteModule, ReactiveFormsModule],
  template: `
    <p-dialog
      header="Asignar Rol a Usuario"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="true"
      [baseZIndex]="10000"
      (onHide)="onClose()">
      @if (role(); as rol) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Rol</label>
            <p class="mt-1 text-gray-900">{{ rol.name }}</p>
          </div>

          <form [formGroup]="assignForm">
            <div>
              <label for="user" class="block text-sm font-medium text-gray-700">Usuario</label>
              <p-autoComplete
                id="user"
                formControlName="userId"
                [suggestions]="users()"
                optionLabel="username"
                dataKey="id"
                placeholder="Seleccione un usuario"
                class="w-full mt-1"
                [dropdown]="true"
                [showClear]="true"
                [appendTo]="'body'"
                [forceSelection]="true"
                (completeMethod)="searchUsers($event)">
                <ng-template let-user pTemplate="item">
                  <div class="flex items-center">
                    <span>{{ user.username }}</span>
                    <small class="ml-2 text-gray-500">({{ user.email }})</small>
                  </div>
                </ng-template>
              </p-autoComplete>
              @if (assignForm.get('userId')?.invalid && assignForm.get('userId')?.touched) {
                <small class="text-red-500">Usuario es requerido</small>
              }
            </div>
          </form>
        </div>
      }

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          icon="pi pi-times"
          type="button"
          (onClick)="onClose()"
          styleClass="p-button-text">
        </p-button>
        <p-button
          label="Asignar"
          icon="pi pi-check"
          type="button"
          (onClick)="onSave()"
          [disabled]="assignForm.invalid"
          [loading]="loading()">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class AssignRoleToUserDialog {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  visible = model<boolean>(false);
  saved = output<AssignRoleDTO>();
  closed = output<void>();

  role = input<Role | null>(null);

  users = signal<User[]>([]);
  loading = signal<boolean>(false);

  assignForm: FormGroup;

  constructor() {
    this.assignForm = this.fb.group({
      userId: [null, [Validators.required]],
    });
  }

  searchUsers(event: any): void {
    this.loading.set(true);
    const pageable: PageableParams = {
      page: 0,
      size: 30, // Limit to 30 for suggestions
    };

    const filters = {
      username: event.query,
    };

    this.userService.getAllUsers(pageable, filters).subscribe({
      next: (response: any) => {
        // Since it's paginated, we get the content from data.content
        const users = response.data.content || [];
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      },
    });
  }

  onSave(): void {
    if (this.assignForm.valid && this.role()) {
      const selectedUser = this.assignForm.get('userId')?.value;
      if (selectedUser) {
        const assignData: AssignRoleDTO = {
          userId: selectedUser.id,
          roleIds: [this.role()!.id],
        };
        this.saved.emit(assignData);
      }
    }
  }

  onClose(): void {
    this.assignForm.reset();
    this.users.set([]);
    this.visible.set(false);
    this.closed.emit();
  }
}