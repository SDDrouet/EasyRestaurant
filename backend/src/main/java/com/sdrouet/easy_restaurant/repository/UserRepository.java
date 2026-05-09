package com.sdrouet.easy_restaurant.repository;

import com.sdrouet.easy_restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    @Query("""
    SELECT u FROM User u
    JOIN FETCH u.roles r
    JOIN FETCH r.permissions
    WHERE u.username = :username
    """)
    Optional<User> findByUsernameWithRolesAndPermissions(@Param("username") String username);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("""
    SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
    FROM User u
    JOIN u.roles r
    WHERE r.id = :roleId
    """)
    boolean existsUserAssignedToRole(@Param("roleId") Long roleId);

    @Modifying
    @Query("UPDATE User u SET u.lastLogin = CURRENT_TIMESTAMP where u.id = :userId")
    void updateLastLoginById(Long userId);
}
