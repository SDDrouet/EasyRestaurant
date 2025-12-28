package com.sdrouet.easy_restaurant.service;

import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import com.sdrouet.easy_restaurant.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    User register(RegisterUserRequest request);

    UserResponse updateUser(UpdateUserRequest updateUserRequest);

    User changeUserStatus(Long userId);

    User getUserById(Long userId);

    Page<User> getUsers(Pageable pageable, String username, String email, String name);
}
