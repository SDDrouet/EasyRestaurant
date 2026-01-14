import { ApiErrorDetail } from "@data/interfaces/common-interface";
import { CustomHttpErrorResponse } from "@data/interfaces/CustomHttpErrorResponse";

export const formatApiError = (error: CustomHttpErrorResponse): ApiErrorDetail => {
    return error.error?.error || { message: 'Ocurrió un error inesperado.', code: 'UNKNOWN_ERROR' };
}