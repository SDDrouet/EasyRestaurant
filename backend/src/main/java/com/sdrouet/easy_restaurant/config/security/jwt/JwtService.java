package com.sdrouet.easy_restaurant.config.security.jwt;

import com.sdrouet.easy_restaurant.dto.auth.RefreshTokenDto;
import com.sdrouet.easy_restaurant.entity.RefreshToken;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import com.sdrouet.easy_restaurant.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

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

    public int invalidateRefreshToken(String token) {
        return tokenRepository.revokeTokenByToken(JwtHashService.hash(token));
    }

    public RefreshTokenDto findRefreshToken(String token) {
        Optional<RefreshTokenDto> tokenOpt = tokenRepository
                .findRefreshTokenByToken(JwtHashService.hash(token));

        if (tokenOpt.isEmpty()) throw ErrorCode.UNAUTHORIZED.exception("JWT no válido");

        return tokenOpt.get();
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void revokeAllRefreshTokenByUser(Long userId) {
        tokenRepository.revokeAllActiveTokensByUser(userId);
    }

    @Transactional
    public String getNewRefreshToken(Authentication authentication, RefreshTokenDto oldRefreshTokenDto) {
        RefreshToken newRefreshTokenEntity = createRefreshToken(authentication);
        String newRefreshToken = newRefreshTokenEntity.getToken();

        newRefreshTokenEntity = saveRefreshToken(newRefreshTokenEntity);

        tokenRepository.revokeTokenById(oldRefreshTokenDto.id(), newRefreshTokenEntity);

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
