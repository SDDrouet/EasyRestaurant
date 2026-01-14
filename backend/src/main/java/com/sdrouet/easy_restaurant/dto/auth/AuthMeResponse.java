package com.sdrouet.easy_restaurant.dto.auth;

import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record AuthMeResponse(
        UserResponse user,
        List<String> permissions
) {}
