import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PATHS } from '@core/configs/paths';
import { AuthService } from '@core/service/auth-service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarNav } from '@layout/main-layout/components/sidebar-nav/sidebar-nav';



@Component({
  selector: 'app-main-layout',
  imports: [ButtonModule, RouterOutlet, AvatarModule, PopoverModule, TooltipModule, SidebarNav],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  private user = this.authService.user;
  
  userInitials = (this.user()?.firstName.charAt(0) || '') + (this.user()?.lastName.charAt(0) || '') || this.user()?.username.charAt(0) || '';  

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/' + PATHS.LOGIN]),
      error: () => this.router.navigate(['/' + PATHS.LOGIN])
    });
  }
}
