import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthApiService } from '@data/api/auth-api-service';
import { Permissions } from '@data/enums/permissions';
import { JwtPayload, LoginData, LoginRequest } from '@data/interfaces/auth-interface';
import { ApiErrorDetail } from '@data/interfaces/common-interface';
import { User } from '@data/interfaces/user-interface';
import { jwtDecode } from "jwt-decode";
import { catchError, firstValueFrom, from, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = inject(AuthApiService);
  private accessToken = signal<string | null>(null);
  private _user = signal<User | null>(null);
  private _permissions = signal<string[]>([]);

  isAuthenticated = computed(() => this.accessToken() !== null);
  user = computed(() => this._user());
  permissions = computed(() => this._permissions());

  login(loginRequest: LoginRequest) {
    return this.authApi.login(loginRequest).pipe(
      switchMap(res =>
        from(this.updateSession(res.data))
      ),
      catchError((err: ApiErrorDetail) => {
        return throwError(() => err.message);
      })
    );
  }


  refreshToken() {
  return this.authApi.refreshToken().pipe(
    switchMap(res =>
      from(this.updateSession(res.data))
    ),
    catchError((err: ApiErrorDetail) => {
      this.clearSession();
      return throwError(() => err.message);
    })
  );
}


  logout() {
    return this.authApi.logout()
      .pipe(
        tap(() => this.clearSession()),
        catchError((err: ApiErrorDetail) => {
          this.clearSession();
          return throwError(() => err.message);
        }),
      );
  }

  async loadMe(): Promise<void> {
    const res = await firstValueFrom(this.authApi.authMe());

    this._user.set(res.data.user);
    this._permissions.set(res.data.permissions);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissions().includes(permission.toString());
  }

  private storeTokens(loginData: LoginData) {
    this.accessToken.set(loginData.accessToken);
  }

  clearTokens() {
    this.accessToken.set(null);
  }

  async updateSession(loginData: LoginData) {
    this.storeTokens(loginData);
    await this.loadMe();
  }


  clearSession() {
    this.clearTokens();
    this._user.set(null);
    this._permissions.set([]);
  }
}
