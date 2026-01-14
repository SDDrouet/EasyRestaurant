import { HttpErrorResponse } from "@angular/common/http";
import { ApiErrorResponse } from "./common-interface";

export interface CustomHttpErrorResponse extends HttpErrorResponse {
    error: ApiErrorResponse;
}