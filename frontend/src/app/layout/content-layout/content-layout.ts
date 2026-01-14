import { Component } from '@angular/core';

@Component({
    selector: 'app-content-layout',
    template: `
    <main class="bg-surface-0/75 rounded-2xl w-full h-full overflow-hidden border border-surface-100">
        <div class="overflow-auto h-full p-4">
            <ng-content />
        </div>
    </main>
  `,
})
export class ContentLayout {}
