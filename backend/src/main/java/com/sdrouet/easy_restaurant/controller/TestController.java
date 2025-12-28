package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
    @GetMapping("/secure")
    @PreAuthorize("hasAuthority('READ_PRODUCT')")
    public ResponseEntity<ApiResponse<Object>> secure() {
        return ResponseEntity.ok(ApiResponse.ok("Operación correcta"));
    }
}
