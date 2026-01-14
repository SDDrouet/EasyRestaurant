import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth-service';
import { PATHS } from '@core/configs/paths';
import { SHARED_UI_MODULES } from '@shared/ui-modules';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '@data/interfaces/auth-interface';

interface LoginFormControls {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [...SHARED_UI_MODULES],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private msg = inject(MessageService);
  private router = inject(Router);
  isInvalid = signal(false);

  loginForm = new FormGroup<LoginFormControls>({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.loginForm.markAllAsTouched();

    if (!this.loginForm.invalid) {
      const loginData: LoginRequest = this.loginForm.getRawValue();
      this.login(loginData);
    }
  }

  login(loginRequest: LoginRequest) {
    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        this.isInvalid.set(false);
        this.msg.add({ severity: 'success', summary: 'Inicio de sesión exitoso', detail: 'Has iniciado sesión correctamente.' });
        this.router.navigate(['/' + PATHS.HOME]);
      },
      error: (errorMessage) => {
        this.isInvalid.set(true);
        this.msg.add({ severity: 'error', summary: 'Inicio de sesión fallido', detail: errorMessage });
      }
    });
  }
}
