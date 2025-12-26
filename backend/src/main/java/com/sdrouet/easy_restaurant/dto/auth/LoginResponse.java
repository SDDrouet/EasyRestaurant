package com.sdrouet.easy_restaurant.dto.auth;

import lombok.Builder;

@Builder
public record LoginResponse(
        String accessToken,
        String tokenType
) {
    public LoginResponse(String accessToken) {
        this(accessToken, "Bearer");
    }
}
