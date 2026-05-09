import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { formatApiError } from '@core/utils/error-formatter';
import { ApiResponse } from '@data/interfaces/common-interface';
import { CustomHttpErrorResponse } from '@data/interfaces/CustomHttpErrorResponse';
import { Pageable, PageableParams } from '@data/interfaces/pageable-interface';
import { Permission, PermissionRequest } from '@data/interfaces/permission-interface';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/permissions';

  create(permissionData: PermissionRequest) {
    return this.http
      .post<ApiResponse<Permission>>(this.baseUrl, permissionData)
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  findById(id: number) {
    return this.http
      .get<ApiResponse<Permission>>(`${this.baseUrl}/${id}`)
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
      .get<ApiResponse<Pageable<Permission>>>(this.baseUrl, { params })
      .pipe(
        catchError((err: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(err));
        })
      );
  }

  update(id: number, permissionData: PermissionRequest) {
    return this.http
      .put<ApiResponse<Permission>>(`${this.baseUrl}/${id}`, permissionData)
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
}