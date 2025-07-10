package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.UserVO;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {
    @Id
    public Integer id;
    public String username;
    public String phone;
    public String password;
    public String image;
    public String role;
    public UserVO toVO(){
        UserVO vo = new UserVO();
        vo.id = this.id;
        vo.username = this.username;
        vo.image = this.image;
        vo.phone = this.phone;
        vo.role = this.role;
        return vo;
    }
}
