import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/service/auth-service';
import { NavSection } from '@data/interfaces/navigation-interface';
import { NAV_SECTIONS } from '../../routes/nav-sections';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-sidebar-nav',
  imports: [ButtonModule, TooltipModule, RouterLink],
  template: `
    <div class="flex flex-col gap-2 items-center">
      @for (section of visibleSections(); track section.id) {
        <button
          pButton
          [icon]="section.icon"
          [rounded]="true"
          [pTooltip]="section.label"
          tooltipPosition="right"
          severity="secondary"
          [routerLink]="section.route"
          [class]="' ' + (isActive(section.route) ? 'p-button-primary' : '')"
          size="large"
        ></button>
      }
    </div>
  `,
})
export class SidebarNav {
  private authService = inject(AuthService);
  private router = inject(Router);

  visibleSections = computed<NavSection[]>(() => {
    return NAV_SECTIONS.filter((section: NavSection) => {
      if (!section.permission) {
        return true;
      }
      return this.authService.hasPermission(section.permission);
    });
  });

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
