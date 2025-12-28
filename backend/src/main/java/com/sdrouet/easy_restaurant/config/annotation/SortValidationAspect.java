package com.sdrouet.easy_restaurant.config.annotation;

import com.sdrouet.easy_restaurant.enums.ErrorCode;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Set;

@Aspect
@Component
public class SortValidationAspect {
    private void validate(Pageable pageable, Set<String> allowedFields) {
        pageable.getSort().forEach(order -> {
            if (!allowedFields.contains(order.getProperty())) {
                throw ErrorCode.BAD_REQUEST.exception("No se permite ordenar por el campo: " + order.getProperty());
            }
        });
    }

    @Around("@annotation(allowedSortFields)")
    public Object validateSort(
            ProceedingJoinPoint joinPoint,
            AllowedSortFields allowedSortFields
    ) throws Throwable {

        Set<String> allowed = Set.of(allowedSortFields.value());

        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof Pageable pageable) {
                validate(pageable, allowed);
                break;
            }
        }

        return joinPoint.proceed();
    }
}
