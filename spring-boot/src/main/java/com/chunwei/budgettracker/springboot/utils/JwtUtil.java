package com.chunwei.budgettracker.springboot.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {

    public static final String SIGN = "aQSkdu@!0#lxWur3$";
    public static final Algorithm ALG = Algorithm.HMAC256(SIGN);
    public static final int EXPIRE_SECOND = 1800;
    public static final int REFRESH_EXPIRE_SECOND = 86400;

    public static String getNewToken(Map<String,String> payload) {
        return buildToken(payload, EXPIRE_SECOND);
    }

    public static String getNewRefreshToken(Map<String,String> payload) {
        return buildToken(payload, REFRESH_EXPIRE_SECOND);
    }

    private static String buildToken(Map<String, String> payload, int expiredSecond) {
        JWTCreator.Builder builder = JWT.create();
        payload.forEach((key, value) -> {
            builder.withClaim(key, value);
        });
        Date issueDate = new Date();
        Date expireDate = new Date(issueDate.getTime() + expiredSecond * 1000L);
        return builder.withIssuedAt(issueDate).withExpiresAt(expireDate).sign(ALG);
    }

    public static Map<String, String> getTokenData(String headToken) {
        return verifyToken(headToken, true);
    }

    public static Map<String, String> verifyToken(String headToken) {
        return verifyToken(headToken, false);
    }

    public static Map<String, String> verifyToken(String headToken, boolean decodeTokenData) {
        // token format: 'Bearer {token}'
        Map<String, String> data = new HashMap<>();
        if (!headToken.startsWith("Bearer ")) {
            throw new JWTVerificationException("Invalid auth, only accept Bearer");
        }

        if (decodeTokenData) {
            Map<String, Claim> claims = JWT.require(ALG)
                    .build()
                    .verify(headToken.substring(7))
                    .getClaims();
            // put into data map
            for (Map.Entry<String, Claim> entry : claims.entrySet()) {
                data.put(entry.getKey(), entry.getValue().asString());
            }
        } else {
            JWT.require(ALG).build().verify(headToken.substring(7));
        }
        return data;
    }
}
