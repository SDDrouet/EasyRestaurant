package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.dto.auth.LoginRequest;
import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import com.sdrouet.easy_restaurant.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Validated @RequestBody LoginRequest request) {
        LoginResponse res = authService.login(request.username(), request.password());
        return ResponseEntity.ok(ApiResponse.ok(
                "Sesión Iniciada correctamente",
                res
        ));
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<Object>> test() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Operación correcta"
        ));
    }
}
