package com.sdrouet.easy_restaurant.repository;

import com.sdrouet.easy_restaurant.dto.auth.RefreshTokenDto;
import com.sdrouet.easy_restaurant.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Query("""
    SELECT new com.sdrouet.easy_restaurant.dto.auth.RefreshTokenDto(
            rt.id,
            rt.token,
            rt.revoked,
            rt.user.id
        )
        FROM RefreshToken rt
        WHERE rt.token = :token
    """)
    Optional<RefreshTokenDto> findRefreshTokenByToken(@Param("token") String token);

    @Modifying
    @Query("""
                UPDATE RefreshToken rt
                SET rt.revoked = true, rt.replacedBy = :replacedBy
                WHERE rt.id = :id
            """)
    int revokeTokenById(@Param("id") Long id, @Param("replacedBy") RefreshToken replacedBy);

    @Modifying
    @Query("""
                UPDATE RefreshToken rt
                SET rt.revoked = true
                WHERE rt.token = :token
            """)
    int revokeTokenByToken(@Param("token") String token);

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

    @Modifying
    @Query("""
                UPDATE RefreshToken rt
                SET rt.revoked = true
                WHERE rt.user.id = :userId
                AND rt.revoked = false
            """)
    int revokeAllActiveTokensByUser(@Param("userId") Long userId);
}
