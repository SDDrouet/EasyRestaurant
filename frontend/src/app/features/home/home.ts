import { Component, signal, effect, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/service/auth-service';
import { TestService } from '@core/service/test-service';
import { Permissions } from '@data/enums/permissions';


@Component({
  selector: 'app-home',
  imports: [ButtonModule, DatePickerModule, FormsModule, PanelMenuModule],
  templateUrl: './home.html',
})
export class Home {
  private authService = inject(AuthService);
  private testService = inject(TestService);
  private msg = inject(MessageService);
  date = signal<Date | null>(null);
  user = this.authService.user;


  constructor() {
    console.log('has permission CREATE_USER: ', this.authService.hasPermission(Permissions.CREATE_USER))
  }

  showPermission() {
    console.log('Permissions: ', this.authService.permissions());
    console.log('has permission CREATE_USER: ', this.authService.hasPermission(Permissions.CREATE_USER));
    console.log(Permissions.CREATE_USER);
  }

  testSecureEndpoint() {
    this.testService.testSecureEndpoint().subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Acceso al endpoint seguro exitoso.' });
      },
      error: (error) => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: error });
      }
    });
  }



}
