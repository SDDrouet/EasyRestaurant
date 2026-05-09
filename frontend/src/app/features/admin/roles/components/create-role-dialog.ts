import { Component, output, model, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RoleRequest } from '@data/interfaces/role-interface';

@Component({
  selector: 'app-create-role-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, TextareaModule, ReactiveFormsModule],
  template: `
    <p-dialog
      header="Crear Rol"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="true"
      [baseZIndex]="10000"
      (onHide)="onClose()">
      <form [formGroup]="createForm" class="space-y-4">
        <div>
          <label for="create-name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            pInputText
            id="create-name"
            formControlName="name"
            class="w-full mt-1"
            placeholder="Ingrese el nombre del rol" />
          @if (createForm.get('name')?.invalid && createForm.get('name')?.touched) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>

        <div>
          <label for="create-description" class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            pInputTextarea
            id="create-description"
            formControlName="description"
            class="w-full mt-1"
            rows="3"
            placeholder="Ingrese la descripción del rol">
          </textarea>
          @if (createForm.get('description')?.invalid && createForm.get('description')?.touched) {
            <small class="text-red-500">Descripción es requerida</small>
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
export class CreateRoleDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  saved = output<RoleRequest>();
  closed = output<void>();

  createForm: FormGroup;

  constructor() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  resetForm(): void {
    this.createForm.reset();
  }

  onSave(): void {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;
      const roleData: RoleRequest = {
        name: formValue.name,
        description: formValue.description,
      };
      this.saved.emit(roleData);
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}