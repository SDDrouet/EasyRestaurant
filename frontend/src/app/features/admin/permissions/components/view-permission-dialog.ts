import { Component, output, model, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Permission } from '@data/interfaces/permission-interface';

@Component({
  selector: 'app-view-permission-dialog',
  imports: [DialogModule, ButtonModule],
  template: `
    <p-dialog
      header="Detalles del Permiso"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="true"
      (onHide)="onClose()">
      @if (permission(); as perm) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ID</label>
            <p class="mt-1 text-gray-900">{{ perm.id }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <p class="mt-1 text-gray-900">{{ perm.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Recurso</label>
            <p class="mt-1 text-gray-900">{{ perm.resource }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Acción</label>
            <p class="mt-1 text-gray-900">{{ perm.action }}</p>
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
export class ViewPermissionDialog {
  visible = model<boolean>(false);
  closed = output<void>();

  permission = input<Permission | null>(null);

  onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}