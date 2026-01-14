package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.config.security.SecurityUtils;
import com.sdrouet.easy_restaurant.dto.auth.AuthMeResponse;
import com.sdrouet.easy_restaurant.dto.auth.LoginRequest;
import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import com.sdrouet.easy_restaurant.service.AuthService;
import com.sdrouet.easy_restaurant.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Validated @RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse serviceResponse = authService.login(request.username(), request.password());
        cookieService.addRefreshTokenCookie(serviceResponse.refreshToken(), response);
        LoginResponse res = new LoginResponse(serviceResponse.accessToken(), null);

        return ResponseEntity.ok(ApiResponse.ok(
                "Sesión iniciada correctamente",
                res
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@CookieValue(name = "refresh-token", required = false) String refreshToken, HttpServletResponse response) {
        LoginResponse serviceResponse = authService.refresh(refreshToken);
        cookieService.addRefreshTokenCookie(serviceResponse.refreshToken(), response);
        LoginResponse res = new LoginResponse(serviceResponse.accessToken(), null);
        return ResponseEntity.ok(ApiResponse.ok(
                "OK",
                res
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthMeResponse>> authMe(HttpServletRequest request) {
        String access_Token = SecurityUtils.getBearerToken(request);

        AuthMeResponse authMeResponse = authService.AuthMe(access_Token);

        return ResponseEntity.ok(ApiResponse.ok(
                "OK",
                authMeResponse
        ));
    }

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<Object>> test() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Server ok"
        ));
    }
}
