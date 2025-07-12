package com.dohaof.sweatflix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// 登录凭证DTO (CredentialsDTO.java)
@AllArgsConstructor
@Data
public class AuthDTO {
    private String phone;
    private String password;
}
