import { Component, output, model, inject, input, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { PermissionService } from '@core/service/permission-service';
import { Role, AssignPermissionsDTO } from '@data/interfaces/role-interface';
import { Permission } from '@data/interfaces/permission-interface';
import { PageableParams } from '@data/interfaces/pageable-interface';


@Component({
  selector: 'app-assign-permissions-dialog',
  imports: [DialogModule, ButtonModule, MultiSelectModule, ReactiveFormsModule],
  template: `
    <p-dialog
      header="Asignar Permisos al Rol"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '600px' }"
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
              <label for="permissions" class="block text-sm font-medium text-gray-700">Permisos</label>
              <p-multiSelect
                id="permissions"
                formControlName="permissionIds"
                [options]="permissions()"
                optionLabel="name"
                optionValue="id"
                [showToggleAll]="true"
                [showHeader]="true"
                [filter]="true"
                filterBy="name"
                placeholder="Seleccione permisos"
                class="w-full mt-1"
                [appendTo]="'body'">
                <ng-template let-permission pTemplate="item">
                  <div class="flex items-center">
                    <span>{{ permission.name }}</span>
                    <small class="ml-2 text-gray-500">({{ permission.resource }} - {{ permission.action }})</small>
                  </div>
                </ng-template>
              </p-multiSelect>
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
          [loading]="loading()">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class AssignPermissionsDialog {
  private fb = inject(FormBuilder);
  private permissionService = inject(PermissionService);

  visible = model<boolean>(false);
  saved = output<AssignPermissionsDTO>();
  closed = output<void>();

  role = input<Role | null>(null);

  permissions = signal<Permission[]>([]);
  loading = signal<boolean>(false);

  assignForm: FormGroup;

  constructor() {
    this.assignForm = this.fb.group({
      permissionIds: [[]],
    });

    effect(() => {
      const rol = this.role();
      if (rol && this.visible()) {
        this.loadPermissions();
        this.assignForm.patchValue({
          permissionIds: rol.permissions.map(p => p.id),
        });
      }
    });
  }

  loadPermissions(): void {
    this.loading.set(true);
    let pageable: PageableParams = {
        page: 0,
        size: 1000,        
    }

    this.permissionService.findAll(pageable).subscribe({
      next: (response) => {
        this.permissions.set(response.data.content);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.loading.set(false);
      },
    });
  }

  onSave(): void {
    if (this.assignForm.valid && this.role()) {
      const formValue = this.assignForm.value;
      const assignData: AssignPermissionsDTO = {
        roleId: this.role()!.id,
        permissionIds: formValue.permissionIds,
      };
      this.saved.emit(assignData);
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}