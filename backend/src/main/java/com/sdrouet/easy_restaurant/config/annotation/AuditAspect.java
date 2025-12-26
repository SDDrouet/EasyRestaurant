package com.sdrouet.easy_restaurant.config.annotation;

import com.sdrouet.easy_restaurant.config.audit.serivce.AuditService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditService auditService;

    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint pjp, AuditableAction auditable) throws Throwable {
        String methodName = pjp.getSignature().getName();
        Object[] args = pjp.getArgs();
        Object result = pjp.proceed();

        auditService.log(
                auditable.action(),
                auditable.resource(),
                methodName,
                args
        );
        return result;
    }
}
