package com.dohaof.sweatflix.exception;

public class SFException extends RuntimeException {
    String code;
    public SFException(String code, String message) {
        super(message);
        this.code = code;
    }
}
