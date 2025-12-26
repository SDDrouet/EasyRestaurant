package com.sdrouet.easy_restaurant.service;

import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserResponse;
import com.sdrouet.easy_restaurant.entity.User;

public interface UserService {
    User register(RegisterUserRequest request);

    UpdateUserResponse updateUser(UpdateUserRequest updateUserRequest);
}
