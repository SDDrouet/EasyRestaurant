import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { formatApiError } from '@core/utils/error-formatter';
import { ApiResponse } from '@data/interfaces/common-interface';
import { CustomHttpErrorResponse } from '@data/interfaces/CustomHttpErrorResponse';
import { Pageable, PageableParams } from '@data/interfaces/pageable-interface';
import { AssignPermissionsDTO, AssignRoleDTO, Role, RoleRequest } from '@data/interfaces/role-interface';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/roles';

  create(roleData: RoleRequest) {
    return this.http
      .post<ApiResponse<Role>>(this.baseUrl, roleData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  findById(id: number) {
    return this.http
      .get<ApiResponse<Role>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  findAll(pageableParams: PageableParams = {}) {
    let params = new HttpParams();

    if (pageableParams.page !== undefined) {
      params = params.set('page', pageableParams.page.toString());
    }
    if (pageableParams.size !== undefined) {
      params = params.set('size', pageableParams.size.toString());
    }
    if (pageableParams.sort) {
      params = params.set('sort', pageableParams.sort + ',' + (pageableParams.direction || 'ASC'));
    }

    return this.http
      .get<ApiResponse<Pageable<Role>>>(this.baseUrl, { params })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  update(id: number, roleData: RoleRequest) {
    return this.http
      .put<ApiResponse<Role>>(`${this.baseUrl}/${id}`, roleData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  delete(id: number) {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  assignPermissions(assignData: AssignPermissionsDTO) {
    return this.http
      .post<ApiResponse<Role>>(`${this.baseUrl}/assign-permissions`, assignData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  assignToUser(assignData: AssignRoleDTO) {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}/assign-to-user`, assignData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }
}