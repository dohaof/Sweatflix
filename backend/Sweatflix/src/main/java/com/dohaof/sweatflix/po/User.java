package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.enums.Role;
import com.dohaof.sweatflix.vo.UserVO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String phone;
    private String password;
    private String image;
    private Role role;
    public UserVO toVO(){
        UserVO vo = new UserVO();
        vo.setId(id);
        vo.setUsername(username);
        vo.setPhone(phone);
        vo.setImage(image);
        vo.setRole(role);
        return vo;
    }
}
