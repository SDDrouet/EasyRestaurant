package com.sdrouet.easy_restaurant.config.security.jwt;

import com.sdrouet.easy_restaurant.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public void cleanup() {

        Date now = new Date();

        int revoked = refreshTokenRepository.revokeExpiredTokens(now);

        Date retentionThreshold = Date.from(
                Instant.now().minus(30, ChronoUnit.MINUTES)
        );

        int deleted = refreshTokenRepository.deleteOldRevokedTokens(retentionThreshold);

        log.info(
                "RefreshToken cleanup executed: revoked={}, deleted={}",
                revoked, deleted
        );
    }
}
