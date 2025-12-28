package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.mapper.UserMapper;
import com.sdrouet.easy_restaurant.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    @PreAuthorize("@userPolicy.canUpdate(#updateUserRequest)")
    ResponseEntity<ApiResponse<UserResponse>> update(@Validated @RequestBody UpdateUserRequest updateUserRequest) {
        UserResponse response = userService.updateUser(updateUserRequest);
        return ResponseEntity.ok(ApiResponse.ok("Usuario actualizado correctamente", response));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('CREATE_USER')")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Validated @RequestBody RegisterUserRequest request) {
        User user = userService.register(request);
        UserResponse userResponse = UserMapper.toUpdateUserResponse(user);
        return ResponseEntity.ok(ApiResponse.ok("Usuario creado con éxito", userResponse));
    }

    @PutMapping("/changeStatus/{userId}")
    @PreAuthorize("hasAuthority('UPDATE_USER_STATUS')")
    ResponseEntity<ApiResponse<UserResponse>> changeStatus(@PathVariable Long userId) {
        User user = userService.changeUserStatus(userId);
        UserResponse userResponse = UserMapper.toUpdateUserResponse(user);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        user.getIsActive()
                                ? "Usuario Activado con éxito" : "Usuario Bloqueado con éxito",
                        userResponse
                )
        );
    }

    @GetMapping("/{userId}")
    @PreAuthorize("@userPolicy.canViewUser(#userId)")
    ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserResponse response = UserMapper.toUpdateUserResponse(user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ANY_USER')")
    ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(@RequestParam(required = false) String username,
                                                                @RequestParam(required = false) String email,
                                                                @RequestParam(required = false) String fullName,
                                                                @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<User> users = userService.getUsers(pageable, username, email, fullName);
        Page<UserResponse> usersResponse = users.map(UserMapper::toUpdateUserResponse);

        return ResponseEntity.ok(ApiResponse.ok(usersResponse));
    }
}
