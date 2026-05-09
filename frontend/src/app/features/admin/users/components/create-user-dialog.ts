import { Component, output, model, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RegisterUser } from '@data/interfaces/user-interface';

@Component({
  selector: 'app-create-user-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule],
  template: `
    <p-dialog 
      header="Crear Usuario" 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '500px' }"
      [closable]="true" 
      (onHide)="onClose()">
      <form [formGroup]="createForm" class="space-y-4">
        <div>
          <label for="create-username" class="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            pInputText 
            id="create-username" 
            formControlName="username" 
            class="w-full mt-1"
            placeholder="Ingrese el nombre de usuario" />
          @if (createForm.get('username')?.invalid && createForm.get('username')?.touched) {
            <small class="text-red-500">Usuario es requerido y debe tener al menos 3 caracteres</small>
          }
        </div>

        <div>
          <label for="create-email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            pInputText 
            id="create-email" 
            type="email" 
            formControlName="email" 
            class="w-full mt-1"
            placeholder="Ingrese el email" />
          @if (createForm.get('email')?.invalid && createForm.get('email')?.touched) {
            <small class="text-red-500">Email válido es requerido</small>
          }
        </div>

        <div>
          <label for="create-password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <p-password 
            id="create-password" 
            formControlName="password" 
            class="mt-1" 
            fluid
            placeholder="Ingrese la contraseña" 
            [toggleMask]="true" 
            [feedback]="false">
          </p-password>
          @if (createForm.get('password')?.invalid && createForm.get('password')?.touched) {
            <small class="text-red-500">Contraseña es requerida y debe tener al menos 6 caracteres</small>
          }
        </div>

        <div>
          <label for="create-firstName" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input 
            pInputText 
            id="create-firstName" 
            formControlName="firstName" 
            class="w-full mt-1"
            placeholder="Ingrese el nombre" />
          @if (createForm.get('firstName')?.invalid && createForm.get('firstName')?.touched) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>

        <div>
          <label for="create-lastName" class="block text-sm font-medium text-gray-700">Apellido</label>
          <input 
            pInputText 
            id="create-lastName" 
            formControlName="lastName" 
            class="w-full mt-1"
            placeholder="Ingrese el apellido" />
          @if (createForm.get('lastName')?.invalid && createForm.get('lastName')?.touched) {
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
export class CreateUserDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  saved = output<RegisterUser>();
  closed = output<void>();

  createForm: FormGroup;

  constructor() {
    this.createForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  resetForm(): void {
    this.createForm.reset();
  }

  onSave(): void {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;
      const userData: RegisterUser = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
      };
      this.saved.emit(userData);
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
