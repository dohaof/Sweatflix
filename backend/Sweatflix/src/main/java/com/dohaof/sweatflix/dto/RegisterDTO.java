package com.dohaof.sweatflix.dto;

import com.dohaof.sweatflix.enums.Role;
import com.dohaof.sweatflix.po.User;
import lombok.Data;

// 注册表单DTO (RegisterDTO.java)
@Data
public class RegisterDTO {
        private String username;
        private String password;
        private String phone;
        private String image;
        private Role role;
        public User toUser() {
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setPhone(phone);
            user.setImage(image);
            user.setRole(role);
            return user;
        }
}
