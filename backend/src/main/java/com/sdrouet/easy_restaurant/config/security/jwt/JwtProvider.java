package com.sdrouet.easy_restaurant.config.security.jwt;

import com.sdrouet.easy_restaurant.entity.RefreshToken;
import com.sdrouet.easy_restaurant.entity.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.MacAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtProvider {
    private final JwtProperties jwtProperties;
    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    private MacAlgorithm getMacAlgorithm() {
        return Jwts.SIG.HS512;
    }

    public String createAccessToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentTime = new Date();
        Date expirationToken = new Date(currentTime.getTime() + jwtProperties.getExpiration());
        return Jwts.builder()
                .claim("typ", "access")
                .subject(username)
                .issuedAt(currentTime)
                .expiration(expirationToken)
                .signWith(getSigningKey(), getMacAlgorithm())
                .compact();
    }

    public RefreshToken createRefreshToken(Authentication authentication) {
        HttpServletRequest request = ((ServletRequestAttributes) Objects
                .requireNonNull(RequestContextHolder.getRequestAttributes()))
                .getRequest();

        String username = authentication.getName();
        Date currentTime = new Date();
        Date expirationToken = new Date(currentTime.getTime() + jwtProperties.getRefreshTokenExpiration());

        String refreshToken = Jwts.builder()
                .id(UUID.randomUUID().toString())
                .claim("typ", "refresh")
                .subject(username)
                .issuedAt(currentTime)
                .expiration(expirationToken)
                .signWith(getSigningKey(), getMacAlgorithm())
                .compact();

        return RefreshToken.builder()
                .createdIp(request.getRemoteAddr())
                .createdAt(currentTime)
                .issuedAt(currentTime)
                .expiresAt(expirationToken)
                .token(refreshToken)
                .revoked(false)
                .userAgent(request.getHeader("User-Agent"))
                .replacedBy(null)
                .user((User) authentication.getPrincipal())
                .build();
    }

    private String validateTokenAndGetType(String token) {
        try {
            if (!StringUtils.hasText(token)) return null;
            return getType(token);
        } catch (JwtException e) {
            logger.warn("Token inválido: {}", e.getMessage());
            return null;
        }
    }

    public boolean isValidAccessToken(String token) {
        String typeToken = validateTokenAndGetType(token);
        if (!StringUtils.hasText(typeToken)) return false;
        return typeToken.equals("access");
    }

    public boolean isValidRefreshToken(String token) {
        String typeToken = validateTokenAndGetType(token);
        if (!StringUtils.hasText(typeToken)) return false;
        return typeToken.equals("refresh");
    }

    public String getSubject(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private String getType(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("typ", String.class);
    }
}
