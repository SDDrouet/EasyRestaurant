package com.sdrouet.easy_restaurant.exception;

import com.sdrouet.easy_restaurant.enums.ErrorCode;

public class ControlledException extends ApiException {

    public ControlledException(ErrorCode code, String message) {
        super(code, message);
    }
}

