package com.dohaof.sweatflix.dto;

import com.dohaof.sweatflix.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private UserVO userVO;

}