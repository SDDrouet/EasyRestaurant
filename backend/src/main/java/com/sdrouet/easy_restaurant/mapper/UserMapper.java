package com.sdrouet.easy_restaurant.mapper;

import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import com.sdrouet.easy_restaurant.entity.User;

public class UserMapper {
    public static UserResponse toUpdateUserResponse(User userUpdated) {
        return UserResponse.builder()
                .id(userUpdated.getId())
                .username(userUpdated.getUsername())
                .email(userUpdated.getEmail())
                .firstName(userUpdated.getFirstName())
                .lastName(userUpdated.getLastName())
                .isActive(userUpdated.getIsActive())
                .build();
    }
}
