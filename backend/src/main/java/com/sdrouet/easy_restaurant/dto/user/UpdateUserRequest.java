package com.sdrouet.easy_restaurant.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest (
        @NotNull Long id,
        @Email @NotBlank String email,
        @NotBlank String firstName,
        @NotBlank String lastName
) { }
