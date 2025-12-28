package com.sdrouet.easy_restaurant.exception;

import com.sdrouet.easy_restaurant.dto.common.ApiErrorResponse;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException e) {
        return build(e.getErrorCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        (error) -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Campo no válido",
                        (a, b) -> a
                ));

        return build(ErrorCode.VALIDATION_ERROR, "Datos Inválidos", errors);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(NoResourceFoundException ex) {
        return build(ErrorCode.RESOURCE_NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials() {
        return build(ErrorCode.BAD_CREDENTIALS, "Credenciales incorrectas");
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiErrorResponse> DisabledUser() {
        return build(ErrorCode.USER_DISABLED, "Acceso denegado, usuario bloqueado");
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiErrorResponse> AuthorizationDeniedCredentials() {
        return build(ErrorCode.FORBIDDEN, "Acceso denegado");
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorResponse> handleJwtException(JwtException e) {
        return build(ErrorCode.BAD_CREDENTIALS, e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
        log.error("Unexpected error", ex);
        return build(ErrorCode.INTERNAL_ERROR, "Tenemos problemas consulte con soporte");
    }

    private ResponseEntity<ApiErrorResponse> build(ErrorCode code, String message) {
        return ResponseEntity
                .status(code.status())
                .body(ApiErrorResponse.of(
                        code.name(),
                        message,
                        null
                ));
    }

    private ResponseEntity<ApiErrorResponse> build(ErrorCode code, String message, Map<String, String> details) {
        return ResponseEntity
                .status(code.status())
                .body(ApiErrorResponse.of(
                        code.name(),
                        message,
                        details
                ));
    }
}
