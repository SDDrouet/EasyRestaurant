package com.sdrouet.easy_restaurant.policy;

import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import org.springframework.stereotype.Component;

@Component("userPolicy")
public class UserPolicy extends BasePolicy {
    public boolean canUpdate(UpdateUserRequest request) {
        if (hasPermission("UPDATE_ANY_USER")) {
            return true;
        }

        if (hasPermission("UPDATE_USER")) {
            return currentUser().getId().equals(request.id());
        }

        return false;
    }

    public boolean canViewUser(Long userId) {
        if (hasPermission("READ_ANY_USER")) return true;

        if (hasPermission("READ_USER")) {
            return currentUser().getId().equals(userId);
        }

        return false;
    }
}
