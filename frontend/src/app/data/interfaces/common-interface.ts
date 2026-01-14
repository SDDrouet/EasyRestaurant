export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface ApiErrorDetail {
    message: string;
    code: string;
    details?: any;
}

export interface ApiErrorResponse {
    success: boolean;
    error: ApiErrorDetail;
    timestamp: string;
}