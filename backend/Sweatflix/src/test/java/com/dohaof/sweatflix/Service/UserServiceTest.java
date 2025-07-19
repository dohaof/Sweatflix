package com.dohaof.sweatflix.Service;

import com.dohaof.sweatflix.dto.LoginResponseDTO;
import com.dohaof.sweatflix.dto.RegisterDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.User;
import com.dohaof.sweatflix.repository.UserRepository;
import com.dohaof.sweatflix.service.serviceImpl.UserServiceImpl;
import com.dohaof.sweatflix.util.TokenUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenUtil tokenUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testLogin_Success() {
        // 模拟数据
        User user = new User();
        user.setPhone("13800138000");
        user.setPassword("encodedPassword");

        // 模拟行为
        when(userRepository.findByPhone("13800138000")).thenReturn(user);
        when(passwordEncoder.matches("123456", "encodedPassword")).thenReturn(true);
        when(tokenUtil.generateToken(user)).thenReturn("mockToken");

        // 调用方法
        LoginResponseDTO response = userService.login("13800138000", "123456");

        // 验证结果
        assertEquals("mockToken", response.getToken());
        verify(userRepository, times(1)).findByPhone("13800138000");
    }

    @Test
    void testLogin_Fail_UserNotFound() {
        when(userRepository.findByPhone("13800138000")).thenReturn(null);
        assertThrows(SFException.class, () -> userService.login("13800138000", "123456"));
    }

    @Test
    void testRegister_Success() {
        RegisterDTO dto = new RegisterDTO();
        dto.setPhone("13800138000");
        dto.setPassword("123456");

        when(userRepository.findByPhone("13800138000")).thenReturn(null);
        when(passwordEncoder.encode("123456")).thenReturn("encodedPassword");

        String result = userService.register(dto);
        assertEquals("注册成功", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegister_Fail_PhoneExists() {
        RegisterDTO dto = new RegisterDTO();
        dto.setPhone("13800138000");

        when(userRepository.findByPhone("13800138000")).thenReturn(new User());
        assertThrows(SFException.class, () -> userService.register(dto));
    }
}
