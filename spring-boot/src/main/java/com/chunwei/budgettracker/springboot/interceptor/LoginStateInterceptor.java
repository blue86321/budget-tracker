package com.chunwei.budgettracker.springboot.interceptor;

import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.chunwei.budgettracker.springboot.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * check if token is valid (to make sure user has logged in)
 * 确认 token 是否有效 (保证用户已登录过, 维持着有效的登录态)
 */
public class LoginStateInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        try {
            String headToken = request.getHeader("Authorization");
            JwtUtil.verifyToken(headToken);
            return true;
        } catch (Exception e) {
            Map<String, Object> data = new HashMap<>();
            String message;
            if (e instanceof SignatureVerificationException) {
                message = "Invalid signature";
            } else if (e instanceof TokenExpiredException) {
                message = "Token expired";
            } else {
                message = "Invalid token";
            }
            data.put("message", message);
            String s = new ObjectMapper().writeValueAsString(data);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(s);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }
    }
}
