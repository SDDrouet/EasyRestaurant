package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.config.annotation.AuditableAction;
import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserResponse;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @AuditableAction(action = "UPDATE", resource = "USER")
    ResponseEntity<ApiResponse<UpdateUserResponse>> update(@Validated @RequestBody UpdateUserRequest updateUserRequest) {
        UpdateUserResponse response = userService.updateUser(updateUserRequest);
        return ResponseEntity.ok(ApiResponse.ok("Usuario actualizado correctamente", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Long>> register(@Validated @RequestBody RegisterUserRequest request) {
        User user = userService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Usuario creado con éxito", user.getId()));
    }
}
