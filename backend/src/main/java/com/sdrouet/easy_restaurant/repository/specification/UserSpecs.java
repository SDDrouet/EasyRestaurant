package com.sdrouet.easy_restaurant.repository.specification;

import com.sdrouet.easy_restaurant.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {

    public static Specification<User> usernameLike(String username) {
        return (root, query, cb) -> {
            if (username == null || username.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("username")),
                    "%" + username.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User> emailLike(String email) {
        return (root, query, cb) -> {
            if (email == null || email.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("email")),
                    "%" + email.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User> fullNameLike(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) {
                return cb.conjunction();
            }

            String like = "%" + name.toLowerCase() + "%";

            return cb.like(
                    cb.lower(
                            cb.concat(
                                    cb.concat(root.get("firstName"), " "),
                                    root.get("lastName")
                            )
                    ),
                    like
            );
        };
    }
}

