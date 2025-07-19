package com.dohaof.sweatflix.util;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.dohaof.sweatflix.po.User;

import java.util.Date;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;

@Component
public class TokenUtil {
    private static final String SECRET = "231880199SummerProj"; // 固定密钥
    private static final long EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7天

    public String generateToken(User user) {
        return JWT.create()
                .withAudience(user.getId().toString())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRES))
                .sign(Algorithm.HMAC256(SECRET)); // 使用固定密钥
    }
    public String generateToken(Integer userId) {
        return JWT.create()
                .withAudience(userId.toString())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRES))
                .sign(Algorithm.HMAC256(SECRET)); // 使用固定密钥
    }
    public boolean verifyToken(String token) {
        try {
            JWT.require(Algorithm.HMAC256(SECRET)).build().verify(token);
            return true; // 验证签名和过期时间
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    public Integer getUserId(String token) {
        return Integer.valueOf(JWT.decode(token).getAudience().get(0));
    }
}