import { inject, Injectable } from '@angular/core';
import { UserApiService } from '@data/api/user-api-service';
import { ApiErrorDetail } from '@data/interfaces/common-interface';
import { PageableParams } from '@data/interfaces/pageable-interface';
import { RegisterUser, User } from '@data/interfaces/user-interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiService = inject(UserApiService);

  getUserById(userId: number) {
    return this.userApiService.getUserById(userId)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  updateUser(updateData: Partial<User>) {
    return this.userApiService.updateUser(updateData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  registerUser(userData: RegisterUser) {
    return this.userApiService.registerUser(userData)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }

  changeUserStatus(userId: number) {
    return this.userApiService.changeUserStatus(userId)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
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
    return this.userApiService.getAllUsers(pageableParams, filters)
      .pipe(
        catchError((error: ApiErrorDetail) => {
          return throwError(() => error.message);
        })
      );
  }
}
