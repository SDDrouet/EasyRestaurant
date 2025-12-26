package com.sdrouet.easy_restaurant.config.audit.serivce;

public interface AuditService {
    void log(String action, String resource, String method, Object parameters);
}
