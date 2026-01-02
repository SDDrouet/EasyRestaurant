package com.sdrouet.easy_restaurant.service;

import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    LoginResponse login(String username, String password);

    LoginResponse refresh(HttpServletRequest request);
}
