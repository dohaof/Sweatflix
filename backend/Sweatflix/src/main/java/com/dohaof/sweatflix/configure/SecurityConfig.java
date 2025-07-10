package com.dohaof.sweatflix.configure;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 返回 BCryptPasswordEncoder 实例
        return new BCryptPasswordEncoder();
    }
//    @Bean 与拦截器冲突，不使用了
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()  // 允许所有请求，无需身份认证
//                )
//                .csrf(AbstractHttpConfigurer::disable);  // 禁用 CSRF 防护（如果需要）
//
//        return http.build();
//    }
}