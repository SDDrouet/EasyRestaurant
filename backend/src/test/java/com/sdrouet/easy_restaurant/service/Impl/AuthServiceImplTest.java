package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.security.jwt.JwtService;
import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    @AfterEach
    void cleanSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldAuthenticateUserAndReturnJwtToken() {
        // Arrange
        String username = "admin";
        String password = "123456";

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(username, password);

        LoginResponse loginResponse =
                new LoginResponse("access-token", "refresh-token");

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(authentication);

        when(jwtService.createToken(authentication))
                .thenReturn(loginResponse);

        // Act
        LoginResponse result = authService.login(username, password);

        // Assert
        assertNotNull(result);
        assertEquals("access-token", result.accessToken());

        assertEquals(
                authentication,
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(authenticationManager, times(1))
                .authenticate(any(Authentication.class));

        verify(jwtService, times(1))
                .createToken(authentication);
    }

    @Test
    void shouldThrowExceptionWhenAuthenticationFails() {
        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(
                BadCredentialsException.class,
                () -> authService.login("admin", "wrong")
        );

        verify(jwtService, never()).createToken(any());
    }
}
