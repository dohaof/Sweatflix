package com.dohaof.sweatflix.vo;

import com.dohaof.sweatflix.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserVO {
    private Integer id;
    private String username;
    private String phone;
    private String image;
    private Role role;
}
