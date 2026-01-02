package com.sdrouet.easy_restaurant.repository;

import com.sdrouet.easy_restaurant.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findRefreshTokenByTokenAndRevoked(String hash, Boolean revoked);

    // 1️⃣ Revocar tokens expirados
    @Modifying
    @Query("""
        UPDATE RefreshToken rt
           SET rt.revoked = true
         WHERE rt.revoked = false
           AND rt.expiresAt < :now
    """)
    int revokeExpiredTokens(@Param("now") Date now);

    // 2️⃣ Borrar tokens revocados y antiguos
    @Modifying
    @Query("""
        DELETE FROM RefreshToken rt
         WHERE rt.revoked = true
           AND rt.expiresAt < :threshold
    """)
    int deleteOldRevokedTokens(@Param("threshold") Date threshold);
}
