import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { formatApiError } from '@core/utils/error-formatter';
import { ApiResponse } from '@data/interfaces/common-interface';
import { CustomHttpErrorResponse } from '@data/interfaces/CustomHttpErrorResponse';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  testEndpoint() {
    return this.http.get<ApiResponse<null>>(`${this.baseUrl}/test/secure`)
      .pipe(
        catchError((error: CustomHttpErrorResponse) => {
          return throwError(() => formatApiError(error));
        })
      );
  }

}
