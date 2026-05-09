import { Component, output, model, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PermissionRequest } from '@data/interfaces/permission-interface';

@Component({
  selector: 'app-create-permission-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, TextareaModule, ReactiveFormsModule],
  template: `
    <p-dialog
      header="Crear Permiso"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="true"
      (onHide)="onClose()">
      <form [formGroup]="createForm" class="space-y-4">
        <div>
          <label for="create-name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            pInputText
            id="create-name"
            formControlName="name"
            class="w-full mt-1"
            placeholder="Ingrese el nombre del permiso" />
          @if (createForm.get('name')?.invalid && createForm.get('name')?.touched) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>

        <div>
          <label for="create-resource" class="block text-sm font-medium text-gray-700">Recurso</label>
          <input
            pInputText
            id="create-resource"
            formControlName="resource"
            class="w-full mt-1"
            placeholder="Ingrese el recurso" />
          @if (createForm.get('resource')?.invalid && createForm.get('resource')?.touched) {
            <small class="text-red-500">Recurso es requerido</small>
          }
        </div>

        <div>
          <label for="create-action" class="block text-sm font-medium text-gray-700">Acción</label>
          <input
            pInputText
            id="create-action"
            formControlName="action"
            class="w-full mt-1"
            placeholder="Ingrese la acción" />
          @if (createForm.get('action')?.invalid && createForm.get('action')?.touched) {
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
          label="Crear"
          icon="pi pi-check"
          type="button"
          (onClick)="onSave()"
          [disabled]="createForm.invalid">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class CreatePermissionDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  saved = output<PermissionRequest>();
  closed = output<void>();

  createForm: FormGroup;

  constructor() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      resource: ['', [Validators.required]],
      action: ['', [Validators.required]],
    });
  }

  resetForm(): void {
    this.createForm.reset();
  }

  onSave(): void {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;
      const permissionData: PermissionRequest = {
        name: formValue.name,
        resource: formValue.resource,
        action: formValue.action,
      };
      this.saved.emit(permissionData);
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}