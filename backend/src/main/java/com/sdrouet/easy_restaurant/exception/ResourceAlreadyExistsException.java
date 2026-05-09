package com.sdrouet.easy_restaurant.exception;

import com.sdrouet.easy_restaurant.enums.ErrorCode;

public class ResourceAlreadyExistsException extends ApiException {

    public ResourceAlreadyExistsException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
