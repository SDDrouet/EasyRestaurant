package com.sdrouet.easy_restaurant.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdrouet.easy_restaurant.config.security.SecurityUtils;
import com.sdrouet.easy_restaurant.dto.common.ApiErrorResponse;
import com.sdrouet.easy_restaurant.entity.RefreshToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class JwtLogout implements LogoutHandler{

    private final JwtService jwtService;
    private final ObjectMapper mapper;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String token = SecurityUtils.getBearerToken(request);
        RefreshToken refreshToken = null;

        if (jwtService.isValidRefreshToken(token)) {
            refreshToken = jwtService.invalidateRefreshToken(token);
        }

        if (refreshToken == null) {
            ApiErrorResponse apiError = ApiErrorResponse.of(
                    HttpStatus.UNAUTHORIZED.name(),
                    "JWT no válido",
                    null
            );

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());

            try {
                response.getWriter().write(mapper.writeValueAsString(apiError));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
