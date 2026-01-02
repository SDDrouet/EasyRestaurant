package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.security.jwt.JwtService;
import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import com.sdrouet.easy_restaurant.entity.RefreshToken;
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

        String accessToken = "access-token";
        RefreshToken refreshToken = RefreshToken.builder()
                .token("refresh-token")
                .build();

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(authentication);

        when(jwtService.createAccessToken(authentication))
                .thenReturn(accessToken);

        when(jwtService.createRefreshToken(authentication))
                .thenReturn(refreshToken);

        when(jwtService.saveRefreshToken(refreshToken)).thenReturn(refreshToken);

        // Act
        LoginResponse result = authService.login(username, password);

        // Assert
        assertNotNull(result);
        assertEquals("access-token", result.accessToken());
        assertEquals("refresh-token", result.refreshToken());

        assertEquals(
                authentication,
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(authenticationManager, times(1))
                .authenticate(any(Authentication.class));

        verify(jwtService, times(1))
                .createAccessToken(authentication);
    }

    @Test
    void shouldThrowExceptionWhenAuthenticationFails() {
        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(
                BadCredentialsException.class,
                () -> authService.login("admin", "wrong")
        );

        verify(jwtService, never()).createAccessToken(any());
    }
}
