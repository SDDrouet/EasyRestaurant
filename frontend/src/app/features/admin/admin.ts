import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/service/auth-service';
import { SectionLayout } from '@layout/section-layout/section-layout';
import { getAdminNav } from './routes/admin-nav';

@Component({
    selector: 'app-admin',
    imports: [SectionLayout],
    template: `
    <app-section-layout [menuItems]="menuItems()" />
  `,
})
export class Admin {
    private authService = inject(AuthService);

    menuItems = computed(() => getAdminNav(this.authService));
}
