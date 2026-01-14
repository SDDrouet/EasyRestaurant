package com.sdrouet.easy_restaurant.dto.auth;

public record RefreshTokenDto(
        Long id,
        String token,
        Boolean revoked,
        Long userId
) {}

