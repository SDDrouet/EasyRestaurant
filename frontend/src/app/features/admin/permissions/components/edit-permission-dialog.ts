import { Component, output, model, inject, input, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Permission, PermissionRequest } from '@data/interfaces/permission-interface';

@Component({
  selector: 'app-edit-permission-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, TextareaModule, ReactiveFormsModule],
  template: `
    <p-dialog
      header="Editar Permiso"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="true"
      (onHide)="onClose()">
      <form [formGroup]="editForm" class="space-y-4">
        <div>
          <label for="edit-name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            pInputText
            id="edit-name"
            formControlName="name"
            class="w-full mt-1"
            placeholder="Ingrese el nombre del permiso" />
          @if (editForm.get('name')?.invalid && editForm.get('name')?.touched) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>

        <div>
          <label for="edit-resource" class="block text-sm font-medium text-gray-700">Recurso</label>
          <input
            pInputText
            id="edit-resource"
            formControlName="resource"
            class="w-full mt-1"
            placeholder="Ingrese el recurso" />
          @if (editForm.get('resource')?.invalid && editForm.get('resource')?.touched) {
            <small class="text-red-500">Recurso es requerido</small>
          }
        </div>

        <div>
          <label for="edit-action" class="block text-sm font-medium text-gray-700">Acción</label>
          <input
            pInputText
            id="edit-action"
            formControlName="action"
            class="w-full mt-1"
            placeholder="Ingrese la acción" />
          @if (editForm.get('action')?.invalid && editForm.get('action')?.touched) {
            <small class="text-red-500">Acción es requerida</small>
          }
        </div>
      </form>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          icon="pi pi-times"
          type="button"
          (onClick)="onClose()"
          styleClass="p-button-text">
        </p-button>
        <p-button
          label="Guardar"
          icon="pi pi-check"
          type="button"
          (onClick)="onSave()"
          [disabled]="editForm.invalid">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class EditPermissionDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  saved = output<{ id: number; data: PermissionRequest }>();
  closed = output<void>();

  permission = input<Permission | null>(null);

  editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      resource: ['', [Validators.required]],
      action: ['', [Validators.required]],
    });

    effect(() => {
      const perm = this.permission();
      if (perm) {
        this.editForm.patchValue({
          name: perm.name,
          resource: perm.resource,
          action: perm.action,
        });
      }
    });
  }

  onSave(): void {
    if (this.editForm.valid && this.permission()) {
      const formValue = this.editForm.value;
      const permissionData: PermissionRequest = {
        name: formValue.name,
        resource: formValue.resource,
        action: formValue.action,
      };
      this.saved.emit({ id: this.permission()!.id, data: permissionData });
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}