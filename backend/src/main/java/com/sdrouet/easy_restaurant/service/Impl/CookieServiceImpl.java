package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.service.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieServiceImpl implements CookieService {
    private static final String REFRESH_TOKEN_NAME = "refresh-token";
    private static final String REFRESH_PATH = "/auth";

    private final boolean secure;

    public CookieServiceImpl() {
        this.secure = false;      // true en prod
    }

    @Override
    public void addRefreshTokenCookie(String token, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .path(REFRESH_PATH)
                .maxAge(Duration.ofMinutes(15L))
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    @Override
    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .path(REFRESH_PATH)
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }
}

