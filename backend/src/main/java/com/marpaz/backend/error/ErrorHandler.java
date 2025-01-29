package com.marpaz.backend.error;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
    })
    public ResponseEntity<ApiError> handleException(Exception exception,
            HttpServletRequest httpServletRequest) {
        ApiError apiError = new ApiError();
        apiError.setPath(httpServletRequest.getRequestURI());
        apiError.setMessage(exception.getMessage());

        if (exception instanceof MethodArgumentNotValidException) {
            apiError.setMessage("Validation error");
            apiError.setStatus(400);
            var validationErrors = ((MethodArgumentNotValidException) exception)
                    .getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage,
                            (existing, replacing) -> existing));
            apiError.setValidationErrors(validationErrors);
        }

        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }
}