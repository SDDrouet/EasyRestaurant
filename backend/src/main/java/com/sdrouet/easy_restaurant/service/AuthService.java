package com.sdrouet.easy_restaurant.service;

import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;

public interface AuthService {
    LoginResponse login(String username, String password);
}
