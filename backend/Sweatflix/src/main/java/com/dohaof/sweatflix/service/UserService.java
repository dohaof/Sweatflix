package com.dohaof.sweatflix.service;

import com.dohaof.sweatflix.dto.ModifyDTO;
import com.dohaof.sweatflix.dto.RegisterDTO;
import com.dohaof.sweatflix.vo.UserVO;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    String login(String phone, String password);
    String register(RegisterDTO registerDTO);
    String updateUser(ModifyDTO modifyDTO);

    UserVO getUser(Integer userId);
}
