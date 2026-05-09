import { inject, Injectable } from '@angular/core';
import { RoleApiService } from '@data/api/role-api-service';
import { ApiErrorDetail } from '@data/interfaces/common-interface';
import { PageableParams } from '@data/interfaces/pageable-interface';
import { AssignPermissionsDTO, AssignRoleDTO, Role, RoleRequest } from '@data/interfaces/role-interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleApiService = inject(RoleApiService);

  create(roleData: RoleRequest) {
    return this.roleApiService.create(roleData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  findById(id: number) {
    return this.roleApiService.findById(id)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  findAll(pageableParams: PageableParams = {}) {
    return this.roleApiService.findAll(pageableParams)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  update(id: number, roleData: RoleRequest) {
    return this.roleApiService.update(id, roleData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  delete(id: number) {
    return this.roleApiService.delete(id)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  assignPermissions(assignData: AssignPermissionsDTO) {
    return this.roleApiService.assignPermissions(assignData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  assignToUser(assignData: AssignRoleDTO) {
    return this.roleApiService.assignToUser(assignData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }
}