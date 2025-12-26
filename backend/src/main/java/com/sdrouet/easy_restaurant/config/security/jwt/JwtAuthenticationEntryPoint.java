package com.sdrouet.easy_restaurant.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdrouet.easy_restaurant.dto.common.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    // This class allows manage authentication exceptions
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");

        String token = request.getHeader("Authorization");

        if (StringUtils.hasText(token)) {
            response.getWriter().write(
                    objectMapper.writeValueAsString(
                            ApiErrorResponse.of(
                                    "UNAUTHORIZED",
                                    "JWT no válido",
                                    null
                            )
                    )
            );
        } else {
            response.getWriter().write(
                    objectMapper.writeValueAsString(
                            ApiErrorResponse.of(
                                    "UNAUTHORIZED",
                                    "No autenticado",
                                    null
                            )
                    )
            );

        }

    }
}
