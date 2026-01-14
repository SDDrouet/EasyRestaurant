package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.security.UserDetailsServiceImpl;
import com.sdrouet.easy_restaurant.config.security.jwt.JwtService;
import com.sdrouet.easy_restaurant.dto.auth.AuthMeResponse;
import com.sdrouet.easy_restaurant.dto.auth.LoginResponse;
import com.sdrouet.easy_restaurant.dto.auth.RefreshTokenDto;
import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import com.sdrouet.easy_restaurant.entity.RefreshToken;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import com.sdrouet.easy_restaurant.mapper.UserMapper;
import com.sdrouet.easy_restaurant.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public LoginResponse refresh(String token) {

        String username = jwtService.getSubject(token);

        RefreshTokenDto oldRefreshToken = jwtService.findRefreshToken(token);

        if (oldRefreshToken.revoked()) {
            jwtService.revokeAllRefreshTokenByUser(oldRefreshToken.userId());
            throw ErrorCode.UNAUTHORIZED.exception("Se uso un refresh-token revocado");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!userDetails.isEnabled()) throw ErrorCode.USER_DISABLED.exception("Acceso denegado, usuario bloqueado");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        String newRefreshToken = jwtService.getNewRefreshToken(authentication, oldRefreshToken);
        String accessToken = jwtService.createAccessToken(authentication);

        return new LoginResponse(accessToken, newRefreshToken);
    }

    @Override
    public AuthMeResponse AuthMe(String token) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserResponse user = UserMapper.toUpdateUserResponse((User) authentication.getPrincipal());
        List<String> permissions = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        return AuthMeResponse.builder()
                .user(user)
                .permissions(permissions)
                .build();
    }
}
