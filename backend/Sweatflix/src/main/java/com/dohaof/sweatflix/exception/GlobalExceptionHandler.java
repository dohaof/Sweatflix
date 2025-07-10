package com.dohaof.sweatflix.exception;

import com.dohaof.sweatflix.vo.Response;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = SFException.class)
    public Response<String> handleAIExternalException(SFException e) {
        e.printStackTrace();
        return Response.buildFailure(e.getMessage(),e.code);
    }
}
