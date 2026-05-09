import { Component, output, model, inject, input, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Role, RoleRequest } from '@data/interfaces/role-interface';

@Component({
  selector: 'app-edit-role-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, TextareaModule, ReactiveFormsModule],
  template: `
    <p-dialog
      header="Editar Rol"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="true"
      [baseZIndex]="10000"
      (onHide)="onClose()">
      <form [formGroup]="editForm" class="space-y-4">
        <div>
          <label for="edit-name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            pInputText
            id="edit-name"
            formControlName="name"
            class="w-full mt-1"
            placeholder="Ingrese el nombre del rol" />
          @if (editForm.get('name')?.invalid && editForm.get('name')?.touched) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>

        <div>
          <label for="edit-description" class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            pInputTextarea
            id="edit-description"
            formControlName="description"
            class="w-full mt-1"
            rows="3"
            placeholder="Ingrese la descripción del rol">
          </textarea>
          @if (editForm.get('description')?.invalid && editForm.get('description')?.touched) {
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
export class EditRoleDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  saved = output<{ id: number; data: RoleRequest }>();
  closed = output<void>();

  role = input<Role | null>(null);

  editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    effect(() => {
      const rol = this.role();
      if (rol) {
        this.editForm.patchValue({
          name: rol.name,
          description: rol.description,
        });
      }
    });
  }

  onSave(): void {
    if (this.editForm.valid && this.role()) {
      const formValue = this.editForm.value;
      const roleData: RoleRequest = {
        name: formValue.name,
        description: formValue.description,
      };
      this.saved.emit({ id: this.role()!.id, data: roleData });
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}