package com.sdrouet.easy_restaurant.exception;

import com.sdrouet.easy_restaurant.enums.ErrorCode;
import lombok.Getter;

@Getter
public abstract class ApiException extends RuntimeException {

    private final ErrorCode errorCode;

    protected ApiException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}

