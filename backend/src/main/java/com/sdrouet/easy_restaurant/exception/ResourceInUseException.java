package com.sdrouet.easy_restaurant.exception;

import com.sdrouet.easy_restaurant.enums.ErrorCode;

public class ResourceInUseException extends ApiException {

    public ResourceInUseException(String message) {
        super(ErrorCode.BUSINESS_ERROR, message);
    }
}

