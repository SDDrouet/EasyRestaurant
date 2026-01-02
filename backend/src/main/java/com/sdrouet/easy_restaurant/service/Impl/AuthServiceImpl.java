package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.security.SecurityUtils;
import com.sdrouet.easy_restaurant.config.security.UserDetailsServiceImpl;
import com.sdrouet.easy_restaurant.config.security.jwt.JwtService;
import com.sdrouet.easy_restaurant.entity.RefreshToken;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import com.sdrouet.easy_restaurant.service.AuthService;
import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public LoginResponse login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        RefreshToken refreshTokenEntity = jwtService.createRefreshToken(authentication);
        String refreshToken = refreshTokenEntity.getToken();
        String accessToken = jwtService.createAccessToken(authentication);

        jwtService.saveRefreshToken(refreshTokenEntity);

        return new LoginResponse(accessToken, refreshToken);
    }

    @Override
    @Transactional
    public LoginResponse refresh(HttpServletRequest request) {
        String oldRefreshToken = SecurityUtils.getBearerToken(request);

        if (!jwtService.isValidRefreshToken(oldRefreshToken)) throw ErrorCode.UNAUTHORIZED.exception("JWT no válido");

        String username = jwtService.getSubject(oldRefreshToken);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        String newRefreshToken = jwtService.getNewRefreshToken(authentication, oldRefreshToken);
        String accessToken = jwtService.createAccessToken(authentication);

        return new LoginResponse(accessToken, newRefreshToken);
    }
}
