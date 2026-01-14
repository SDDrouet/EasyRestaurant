import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { PATHS } from '@core/configs/paths';
import { AuthService } from '@core/service/auth-service';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MAIN_NAV } from '../../routes/main-nav';
import { AvatarModule } from 'primeng/avatar';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';



@Component({
  selector: 'app-main-layout',
  imports: [PanelMenuModule, ButtonModule, RouterOutlet, AvatarModule, PopoverModule, TooltipModule],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  MAIN_NAV = MAIN_NAV;
  private user = this.authService.user;
  userInitials = (this.user()?.firstName.charAt(0) || '') + (this.user()?.lastName.charAt(0) || '') || this.user()?.username.charAt(0) || '';  

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/' + PATHS.LOGIN]),
      error: () => this.router.navigate(['/' + PATHS.LOGIN])
    });
  }
}
