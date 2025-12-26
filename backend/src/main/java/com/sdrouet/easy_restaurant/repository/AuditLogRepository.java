package com.sdrouet.easy_restaurant.repository;

import com.sdrouet.easy_restaurant.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
