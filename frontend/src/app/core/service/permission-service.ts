import { inject, Injectable } from '@angular/core';
import { PermissionApiService } from '@data/api/permission-api-service';
import { ApiErrorDetail } from '@data/interfaces/common-interface';
import { PageableParams } from '@data/interfaces/pageable-interface';
import { Permission, PermissionRequest } from '@data/interfaces/permission-interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionApiService = inject(PermissionApiService);

  create(permissionData: PermissionRequest) {
    return this.permissionApiService.create(permissionData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  findById(id: number) {
    return this.permissionApiService.findById(id)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  findAll(pageableParams: PageableParams = {}) {
    return this.permissionApiService.findAll(pageableParams)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  update(id: number, permissionData: PermissionRequest) {
    return this.permissionApiService.update(id, permissionData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  delete(id: number) {
    return this.permissionApiService.delete(id)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }
}