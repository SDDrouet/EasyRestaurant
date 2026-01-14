import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-section-layout',
    imports: [RouterOutlet, MenubarModule],
    template: `
    <div class="flex flex-col h-full w-full">
      <div class="mb-4">
        <p-menubar [model]="menuItems()" class="border border-surface-100 bg-surface-0/75"/>
      </div>
      <main class="overflow-hidden">
            <router-outlet />
    </main>
    </div>
  `,
})
export class SectionLayout {
    menuItems = input.required<MenuItem[]>();
}
