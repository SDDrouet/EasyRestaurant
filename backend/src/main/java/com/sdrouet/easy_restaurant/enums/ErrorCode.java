package com.sdrouet.easy_restaurant.enums;

import com.sdrouet.easy_restaurant.exception.ApiException;
import com.sdrouet.easy_restaurant.exception.ControlledException;
import org.springframework.http.HttpStatus;

public enum ErrorCode {
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST),
    BAD_CREDENTIALS(HttpStatus.UNAUTHORIZED),
    BAD_REQUEST(HttpStatus.BAD_REQUEST),
    USER_DISABLED(HttpStatus.FORBIDDEN),
    FORBIDDEN(HttpStatus.FORBIDDEN),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND),
    BUSINESS_ERROR(HttpStatus.BAD_REQUEST),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR);

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }

    public ApiException exception() {
        return new ControlledException(this, this.name());
    }

    public ApiException exception(String message) {
        return new ControlledException(this, message);
    }
}
