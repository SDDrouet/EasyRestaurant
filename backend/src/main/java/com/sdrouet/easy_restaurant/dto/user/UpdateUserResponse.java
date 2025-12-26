package com.sdrouet.easy_restaurant.dto.user;

import lombok.Builder;

@Builder
public record UpdateUserResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName
) {}
