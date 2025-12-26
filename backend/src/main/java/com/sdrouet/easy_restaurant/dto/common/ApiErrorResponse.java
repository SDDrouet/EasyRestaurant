package com.sdrouet.easy_restaurant.dto.common;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiErrorResponse(
        boolean success,
        ErrorDetail error,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime timestamp
) {
    public static ApiErrorResponse of(String code, String message, Map<String, String> details) {
        return new ApiErrorResponse(false, new ErrorDetail(code, message, details), LocalDateTime.now());
    }

    public record ErrorDetail(
            String code,
            String message,
            Map<String, String> details
    ) {}
}
