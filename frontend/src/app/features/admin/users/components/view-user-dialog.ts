import { Component, input, output, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { User } from '@data/interfaces/user-interface';

@Component({
  selector: 'app-view-user-dialog',
  imports: [DialogModule],
  template: `
    <p-dialog 
      header="Detalles del Usuario" 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '500px' }"
      [closable]="true" 
      (onHide)="onClose()">
      @if (user()) {
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">ID</label>
              <p class="mt-1 text-sm text-gray-900">{{ user()!.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Usuario</label>
              <p class="mt-1 text-sm text-gray-900">{{ user()!.username }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <p class="mt-1 text-sm text-gray-900">{{ user()!.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <p class="mt-1 text-sm text-gray-900">{{ user()!.firstName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido</label>
              <p class="mt-1 text-sm text-gray-900">{{ user()!.lastName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <p class="mt-1 text-sm text-gray-900">{{ user()!.isActive ? 'Activo' : 'Inactivo' }}</p>
            </div>
          </div>
        </div>
      }
    </p-dialog>
  `,
})
export class ViewUserDialog {
  visible = model<boolean>(false);
  user = input<User | null>(null);
  closed = output<void>();

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
