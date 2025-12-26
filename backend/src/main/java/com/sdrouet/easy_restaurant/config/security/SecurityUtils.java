package com.sdrouet.easy_restaurant.config.security;

import com.sdrouet.easy_restaurant.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;

        return (User) auth.getPrincipal(); // o extraer desde UserDetails
    }
}
