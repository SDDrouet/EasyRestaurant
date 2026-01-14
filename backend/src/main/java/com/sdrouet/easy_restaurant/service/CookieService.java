package com.sdrouet.easy_restaurant.service;

import jakarta.servlet.http.HttpServletResponse;

public interface CookieService {

    void addRefreshTokenCookie(
            String token,
            HttpServletResponse response
    );

    void deleteRefreshTokenCookie(HttpServletResponse response);
}

