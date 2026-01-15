import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { formatApiError } from '@core/utils/error-formatter';
import { ApiResponse } from '@data/interfaces/common-interface';
import { CustomHttpErrorResponse } from '@data/interfaces/CustomHttpErrorResponse';
import { Pageable, PageableParams } from '@data/interfaces/pageable-interface';
import { User } from '@data/interfaces/user-interface';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/user';

  getUserById(userId: number) {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/${userId}`)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  updateUser(updateData: Partial<User>) {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/update`, updateData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  registerUser(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.http
      .post<ApiResponse<User>>(`${this.baseUrl}/register`, userData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  changeUserStatus(userId: number) {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/changeStatus/${userId}`, {})
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  getAllUsers(
    pageableParams: PageableParams = {},
    filters: {
      username?: string;
      email?: string;
      fullName?: string;
    } = {}
  ) {
    let params = new HttpParams();

    // Add pagination params
    if (pageableParams.page !== undefined) {
      params = params.set('page', pageableParams.page.toString());
    }
    if (pageableParams.size !== undefined) {
      params = params.set('size', pageableParams.size.toString());
    }
    if (pageableParams.sort) {
      params = params.set('sort', pageableParams.sort + ',' + (pageableParams.direction || 'ASC'));
    }

    // Add filter params
    if (filters.username) {
      params = params.set('username', filters.username);
    }
    if (filters.email) {
      params = params.set('email', filters.email);
    }
    if (filters.fullName) {
      params = params.set('fullName', filters.fullName);
    }

    return this.http
      .get<ApiResponse<Pageable<User>>>(this.baseUrl, { params })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }
}
