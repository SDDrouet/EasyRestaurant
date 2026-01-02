package com.sdrouet.easy_restaurant.config.security.jwt;

import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.stereotype.Component;

@Component
public class JwtHashService {
    public static String hash(String token) {
        return Sha512DigestUtils.shaHex(token);
    }
}
