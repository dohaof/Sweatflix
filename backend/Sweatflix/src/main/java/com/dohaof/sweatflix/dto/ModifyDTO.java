package com.dohaof.sweatflix.dto;

import lombok.Data;

@Data
public class ModifyDTO {
    private Integer id;
    private String username;
    private String newPassword;
    private String oldPassword;
    private String image;
}