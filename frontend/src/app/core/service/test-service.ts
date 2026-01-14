import { inject, Injectable } from '@angular/core';
import { TestApiService } from '@data/api/test-api-service';
import { ApiErrorDetail } from '@data/interfaces/common-interface';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private testApiService = inject(TestApiService);

  testSecureEndpoint() {
    return this.testApiService.testEndpoint()
      .pipe(
        tap(() => {
          console.log('Test endpoint accessed successfully');
        }),
        catchError((error: ApiErrorDetail) => {
          console.error('Error accessing test endpoint', error);
          return throwError(() => error.message);
        })
      );
  }
}
