package com.sdrouet.easy_restaurant.mapper;

import com.sdrouet.easy_restaurant.dto.user.UpdateUserResponse;
import com.sdrouet.easy_restaurant.entity.User;

public class UserMapper {
    public static UpdateUserResponse toUpdateUserResponse(User userUpdated) {
        return UpdateUserResponse.builder()
                .id(userUpdated.getId())
                .username(userUpdated.getUsername())
                .email(userUpdated.getEmail())
                .firstName(userUpdated.getFirstName())
                .lastName(userUpdated.getLastName())
                .build();
    }
}
