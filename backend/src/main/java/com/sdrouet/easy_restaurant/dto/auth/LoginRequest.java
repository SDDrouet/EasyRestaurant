package com.sdrouet.easy_restaurant.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
public record LoginRequest (
        @NotBlank String username,
        @NotBlank String password
) {}
