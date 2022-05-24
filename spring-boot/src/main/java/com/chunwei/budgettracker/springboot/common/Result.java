package com.chunwei.budgettracker.springboot.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;

public class Result {

    static final HttpStatus DEFAULT_FAIL_STATUS = HttpStatus.BAD_REQUEST;
    static final HttpStatus DEFAULT_SUCCESS_STATUS = HttpStatus.OK;


    private static ResponseEntity<Object> result(HttpStatus status, String message, Object data) {
        ResponseBody responseBody = new ResponseBody(status.value(), message, data);
        return ResponseEntity.status(status).body(responseBody);
    }

    public static ResponseEntity<Object> success() {
        return result(DEFAULT_SUCCESS_STATUS, "", new HashMap<>());
    }

    public static ResponseEntity<Object> success(Object data) {
        return data == null ? success() : result(DEFAULT_SUCCESS_STATUS, "", data);
    }

    public static ResponseEntity<Object> success(String message) {
        return result(DEFAULT_SUCCESS_STATUS, message, new HashMap<>());
    }

    public static ResponseEntity<Object> success(HttpStatus status, String message, Object data) {
        return result(DEFAULT_SUCCESS_STATUS, "", data);
    }


    public static ResponseEntity<Object> fail(HttpStatus status) {
        return result(status, "", new HashMap<>());
    }

    public static ResponseEntity<Object> fail(Object data) {
        return result(DEFAULT_FAIL_STATUS, "", data);
    }

    public static ResponseEntity<Object> fail() {
        return result(DEFAULT_FAIL_STATUS, "", new HashMap<>());
    }

    public static ResponseEntity<Object> fail(String message) {
        return result(DEFAULT_FAIL_STATUS, message, new HashMap<>());
    }

    public static ResponseEntity<Object> fail(HttpStatus status, String message) {
        return result(status, message, new HashMap<>());
    }

    public static ResponseEntity<Object> fail(HttpStatus status, String message, Object data) {
        return result(status, message, data);
    }
}
