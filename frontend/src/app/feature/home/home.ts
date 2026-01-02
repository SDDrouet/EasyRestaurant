import { Component, signal, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-home',
  imports: [ButtonModule, DatePickerModule, FormsModule, PanelMenuModule],
  templateUrl: './home.html',
})
export class Home {
  date = signal<Date | null>(null);

  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Administración',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          items: [
            {
              label: 'Registrar',
              icon: 'pi pi-users',
            },
            {
              label: 'Registrar',
              icon: 'pi pi-users',
            },
            {
              label: 'Registrar fsdf sdfsd fsdf sdfs dfgddfg dfg dfg dg fdg fdgf sdg fdg gd seg wsg ',
              icon: 'pi pi-users',
            },
          ]
        },
        {
          label: 'Roles',
          icon: 'pi pi-shield',
          routerLink: '/admin/roles'
        }
      ]
    }
  ];

  constructor() {
    effect(() => {
      console.log(this.date());
    });
  }

}
