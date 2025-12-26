package com.sdrouet.easy_restaurant.config.security.jwt;

import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtProvider jwtProvider;

    public LoginResponse createToken(Authentication authentication) {
        String token = jwtProvider.createToken(authentication);
        return new LoginResponse(token);
    }

    public boolean validateToken(String token) {
        return jwtProvider.validateToken(token);
    }

    public String getSubject(String token) {
        return jwtProvider.getSubject(token);
    }
}
