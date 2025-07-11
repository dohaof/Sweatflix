package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.dto.LoginResponseDTO;
import com.dohaof.sweatflix.dto.ModifyDTO;
import com.dohaof.sweatflix.dto.RegisterDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.User;
import com.dohaof.sweatflix.repository.UserRepository;
import com.dohaof.sweatflix.service.UserService;
import com.dohaof.sweatflix.util.TokenUtil;
import com.dohaof.sweatflix.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final TokenUtil tokenUtil;
    private final PasswordEncoder passwordEncoder;
    @Override
    public LoginResponseDTO login(String phone, String password) {
        User user = userRepository.findByPhone(phone);
        if (user == null|| !passwordEncoder.matches(password, user.getPassword())) {
            throw new SFException("409","手机号不已存在/密码错误");
        }
        return new LoginResponseDTO(tokenUtil.generateToken(user),user.toVO());
    }

    @Override
    public String register(RegisterDTO registerDTO) {
        User user = userRepository.findByPhone(registerDTO.getPhone());
        if (user != null) {
            throw new SFException("409","手机号已存在");
        }
        User newUser = registerDTO.toUser();
        newUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        userRepository.save(newUser);
        return "注册成功";
    }

    @Override
    public String updateUser(ModifyDTO modifyDTO) {
        User user = userRepository.findById(modifyDTO.getId()).orElseThrow(()->new SFException("409","用户不存在"));
        if (user == null|| !passwordEncoder.matches(modifyDTO.getOldPassword(), user.getPassword())) {
            throw new SFException("409","旧密码错误");
        }
        if(modifyDTO.getImage() != null && !modifyDTO.getImage().isEmpty()){
            user.setImage(modifyDTO.getImage());
        }
        if (modifyDTO.getOldPassword() != null && !modifyDTO.getOldPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(modifyDTO.getOldPassword()));
        }
        if (modifyDTO.getUsername() != null && !modifyDTO.getUsername().isEmpty()) {
            user.setUsername(modifyDTO.getUsername());
        }
        userRepository.save(user);
        return "修改成功";
    }

    @Override
    public UserVO getUser(Integer userId) {
        return userRepository.findById(userId).orElseThrow(()->new SFException("409","用户不存在")).toVO();
    }
}
