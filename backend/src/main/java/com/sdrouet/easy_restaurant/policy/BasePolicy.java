package com.sdrouet.easy_restaurant.policy;

import com.sdrouet.easy_restaurant.entity.User;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class BasePolicy {
    protected User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            throw new AuthorizationDeniedException("");
        }

        return user;
    }

    protected boolean hasPermission(String permission) {
        return currentUser().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(permission));
    }
}
