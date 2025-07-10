package com.dohaof.sweatflix.exception;

public class SFException extends RuntimeException {
    String code;
    public SFException(String message, String code) {
        super(message);
        this.code = code;
    }
}
