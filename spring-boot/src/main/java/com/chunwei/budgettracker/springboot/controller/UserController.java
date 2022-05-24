package com.chunwei.budgettracker.springboot.controller;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.chunwei.budgettracker.springboot.common.Result;
import com.chunwei.budgettracker.springboot.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody Map<String, Object> map) {
        try {
            Object data = userService.register(map);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "Register error");
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, Object> map) {
        try {
            Object data = userService.login(map);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "Login error");
            return Result.fail(e.getMessage());
        }
    }

    @GetMapping("/info")
    public ResponseEntity<Object> info(HttpServletRequest request) {
        try {
            Object data = userService.getUserInfoByRequest(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get user info error");
        }
    }

    @GetMapping("/partner/invite")
    public ResponseEntity<Object> getInvitation(HttpServletRequest request) {
        try {
            Object data = userService.getInvitation(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get invitation error");
        }
    }

    @PostMapping("/partner/invite")
    public ResponseEntity<Object> respondInvitation(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = userService.respondInvitation(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Respond invitation error");
        }
    }

    @GetMapping("/partner/list")
    public ResponseEntity<Object> getPartner(HttpServletRequest request) {
        try {
            Object data = userService.getPartnerList(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get partner list error");
        }
    }

    @DeleteMapping("/partner")
    public ResponseEntity<Object> revokePartner(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = userService.revokePartner(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "Revoke partner list error");
            return Result.fail(e.getMessage());
        }
    }

    @GetMapping("/stat")
    public ResponseEntity<Object> getUserStat(HttpServletRequest request) {
        try {
            Object data = userService.getUserStat(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get user stat error");
        }
    }

    @GetMapping("/recent_detail")
    public ResponseEntity<Object> getUserRecentDetailPersonal(@RequestParam Map<String, String> map,
                                                              HttpServletRequest request) {
        try {
            Object data = userService.getUserRecentDetail(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get user/recent_detail/personal error");
        }
    }

    @PostMapping("/refresh_token")
    public ResponseEntity<Object> refreshToken(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = userService.refreshToken(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "Refresh token expired");
            if (e instanceof TokenExpiredException) {
                return Result.fail("Refresh token expired");
            }
            return Result.fail("Refresh token error");
        }
    }
}
