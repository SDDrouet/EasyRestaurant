package com.sdrouet.easy_restaurant.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdrouet.easy_restaurant.config.security.SecurityUtils;
import com.sdrouet.easy_restaurant.dto.common.ApiErrorResponse;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class JwtRefreshFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ObjectMapper mapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String REFRESH_PATH = "/auth/refresh";
        return !REFRESH_PATH.equals(request.getServletPath());
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String refreshToken = SecurityUtils.getCookie(request, "refresh-token");

        if (!jwtService.isValidRefreshToken(refreshToken)) {
            ApiErrorResponse apiError = ApiErrorResponse.of(
                    HttpStatus.UNAUTHORIZED.name(),
                    "No autorizado",
                    null
            );

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());

            response.getWriter().write(mapper.writeValueAsString(apiError));

            return;
        }

        filterChain.doFilter(request, response);

    }
}
