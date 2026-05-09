import { Component, input, output, model, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '@data/interfaces/user-interface';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  template: `
    <p-dialog 
      header="Editar Usuario" 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '500px' }"
      [closable]="true" 
      (onHide)="onClose()">
      <form [formGroup]="editForm" class="space-y-4">
        <div>
          <label for="edit-username" class="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            pInputText 
            id="edit-username" 
            [value]="editForm.value.username" 
            class="w-full mt-1"
            placeholder="Ingrese el nombre de usuario" 
            [disabled]="true" />
        </div>

        <div>
          <label for="edit-email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            pInputText 
            id="edit-email" 
            type="email" 
            formControlName="email" 
            class="w-full mt-1"
            placeholder="Ingrese el email" />
          @if (editForm.get('email')?.invalid && editForm.get('email')?.touched) {
            <small class="text-red-500">Email válido es requerido</small>
          }
        </div>

        <div>
          <label for="edit-firstName" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input 
            pInputText 
            id="edit-firstName" 
            formControlName="firstName" 
            class="w-full mt-1"
            placeholder="Ingrese el nombre" />
          @if (editForm.get('firstName')?.invalid && editForm.get('firstName')?.touched) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>

        <div>
          <label for="edit-lastName" class="block text-sm font-medium text-gray-700">Apellido</label>
          <input 
            pInputText 
            id="edit-lastName" 
            formControlName="lastName" 
            class="w-full mt-1"
            placeholder="Ingrese el apellido" />
          @if (editForm.get('lastName')?.invalid && editForm.get('lastName')?.touched) {
            <small class="text-red-500">Apellido es requerido</small>
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
export class EditUserDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  user = input<User | null>(null);
  saved = output<Partial<User>>();
  closed = output<void>();

  editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });

    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.editForm.patchValue({
          username: currentUser.username,
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
        });
      }
    });
  }

  onSave(): void {
    if (this.editForm.valid && this.user()) {
      const formValue = this.editForm.value;
      const updateData: Partial<User> = {
        id: this.user()!.id,
        username: formValue.username,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
      };
      this.saved.emit(updateData);
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
