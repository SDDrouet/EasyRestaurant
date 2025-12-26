package com.sdrouet.easy_restaurant.repository;

import com.sdrouet.easy_restaurant.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
