package com.sdrouet.easy_restaurant.exception;

import com.sdrouet.easy_restaurant.enums.ErrorCode;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }
}
