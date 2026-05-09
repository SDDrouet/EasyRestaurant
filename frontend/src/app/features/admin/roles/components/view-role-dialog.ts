import { Component, output, model, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Role } from '@data/interfaces/role-interface';

@Component({
  selector: 'app-view-role-dialog',
  imports: [DialogModule, ButtonModule],
  template: `
    <p-dialog
      header="Detalles del Rol"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '600px' }"
      [closable]="true"
      (onHide)="onClose()">
      @if (role(); as rol) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ID</label>
            <p class="mt-1 text-gray-900">{{ rol.id }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <p class="mt-1 text-gray-900">{{ rol.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <p class="mt-1 text-gray-900">{{ rol.description }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Permisos</label>
            <div class="mt-1">
              @if (rol.permissions.length > 0) {
                <ul class="list-disc list-inside text-gray-900">
                  @for (permission of rol.permissions; track permission.id) {
                    <li>{{ permission.name }} ({{ permission.resource }} - {{ permission.action }})</li>
                  }
                </ul>
              } @else {
                <p class="text-gray-500">Sin permisos asignados</p>
              }
            </div>
          </div>
        </div>
      }

      <ng-template pTemplate="footer">
        <p-button
          label="Cerrar"
          icon="pi pi-times"
          type="button"
          (onClick)="onClose()"
          styleClass="p-button-text">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ViewRoleDialog {
  visible = model<boolean>(false);
  closed = output<void>();

  role = input<Role | null>(null);

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}