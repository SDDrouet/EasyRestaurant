import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { formatApiError } from '@core/utils/error-formatter';
import { AuthMe, LoginData, LoginRequest } from '@data/interfaces/auth-interface';
import { ApiResponse } from '@data/interfaces/common-interface';
import { CustomHttpErrorResponse } from '@data/interfaces/CustomHttpErrorResponse';
import { environment } from '@env/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(loginRequest: LoginRequest): Observable<ApiResponse<LoginData>> {
    return this.http
      .post<ApiResponse<LoginData>>(`${this.baseUrl}/auth/login`, loginRequest, { withCredentials: true })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  refreshToken(): Observable<ApiResponse<LoginData>> {
    return this.http.post<ApiResponse<LoginData>>(`${this.baseUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  authMe(): Observable<ApiResponse<AuthMe>> {
    return this.http.get<ApiResponse<AuthMe>>(`${this.baseUrl}/auth/me`, { withCredentials: true })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }
}
