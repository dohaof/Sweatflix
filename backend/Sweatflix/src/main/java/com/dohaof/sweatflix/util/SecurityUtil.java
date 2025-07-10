package com.dohaof.sweatflix.util;

import com.dohaof.sweatflix.po.User;
import com.dohaof.sweatflix.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {
    @Autowired
    UserRepository userRepository;

    public User getCurrentUser(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        return userId != null ? userRepository.findById(userId).orElse(null) : null;
    }
}