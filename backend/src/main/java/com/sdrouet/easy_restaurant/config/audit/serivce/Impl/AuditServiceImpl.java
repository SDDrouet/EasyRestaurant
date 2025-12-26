package com.sdrouet.easy_restaurant.config.audit.serivce.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdrouet.easy_restaurant.config.security.SecurityUtils;
import com.sdrouet.easy_restaurant.entity.AuditLog;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.repository.AuditLogRepository;
import com.sdrouet.easy_restaurant.config.audit.serivce.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {
    private final AuditLogRepository auditLogRepository;
    private final HttpServletRequest request;
    private final ObjectMapper mapper;

    @Override
    public void log(String action, String resource, String method, Object parameters) {
        User user = SecurityUtils.getCurrentUser();

        AuditLog audit = AuditLog.builder()
                .user(user)
                .action(action)
                .resource(resource)
                .method(method)
                .parameters(toJson(parameters))
                .ipAddress(getClientIp())
                .userAgent(request.getHeader("User-Agent"))
                .build();

        auditLogRepository.save(audit);
    }

    private String toJson(Object obj) {
        if (obj == null) return null;
        try {
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "ERROR_SERIALIZING";
        }
    }

    private String getClientIp() {
        String forwarded = request.getHeader("X-Forwarded-For");
        return forwarded != null ? forwarded.split(",")[0] : request.getRemoteAddr();
    }
}
