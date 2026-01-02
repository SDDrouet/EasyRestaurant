package com.sdrouet.easy_restaurant.config.security.jwt;

import com.sdrouet.easy_restaurant.entity.RefreshToken;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import com.sdrouet.easy_restaurant.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository tokenRepository;

    public String createAccessToken(Authentication authentication) {
        return jwtProvider.createAccessToken(authentication);
    }

    public RefreshToken createRefreshToken(Authentication authentication) {
        return jwtProvider.createRefreshToken(authentication);
    }

    public RefreshToken saveRefreshToken(RefreshToken refreshTokenEntity) {
        String hashRefreshToken = JwtHashService.hash(refreshTokenEntity.getToken());
        refreshTokenEntity.setToken(hashRefreshToken);
        return tokenRepository.save(refreshTokenEntity);
    }

    public RefreshToken invalidateRefreshToken(String token) {
        Optional<RefreshToken> refreshTokenOpt = tokenRepository
                .findRefreshTokenByTokenAndRevoked(JwtHashService.hash(token), false);
        if (refreshTokenOpt.isEmpty()) return null;
        RefreshToken refreshToken = refreshTokenOpt.get();
        refreshToken.setRevoked(true);

        return tokenRepository.save(refreshToken);
    }

    public String getNewRefreshToken(Authentication authentication, String oldRefreshToken) {
        Optional<RefreshToken> oldRefreshTokenOpt = tokenRepository
                .findRefreshTokenByTokenAndRevoked(JwtHashService.hash(oldRefreshToken), false);

        if (oldRefreshTokenOpt.isEmpty()) throw ErrorCode.UNAUTHORIZED.exception("JWT no válido");

        RefreshToken oldRefreshTokenEntity = oldRefreshTokenOpt.get();
        RefreshToken newRefreshTokenEntity = createRefreshToken(authentication);
        String newRefreshToken = newRefreshTokenEntity.getToken();

        newRefreshTokenEntity = saveRefreshToken(newRefreshTokenEntity);

        oldRefreshTokenEntity.setRevoked(true);
        oldRefreshTokenEntity.setReplacedBy(newRefreshTokenEntity);

        tokenRepository.save(oldRefreshTokenEntity);

        return newRefreshToken;
    }

    public boolean isValidAccessToken(String token) {
        return jwtProvider.isValidAccessToken(token);
    }

    public boolean isValidRefreshToken(String token) {
        return jwtProvider.isValidRefreshToken(token);
    }

    public String getSubject(String token) {
        return jwtProvider.getSubject(token);
    }
}
