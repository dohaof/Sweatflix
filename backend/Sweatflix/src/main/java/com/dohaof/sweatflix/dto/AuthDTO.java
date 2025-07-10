package com.dohaof.sweatflix.dto;

import lombok.Data;

// 登录凭证DTO (CredentialsDTO.java)
@Data
public class AuthDTO {
    private String phone;
    private String password;
}
