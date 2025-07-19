package com.dohaof.sweatflix.controller;
import com.dohaof.sweatflix.configure.LoginInterceptor;
import com.dohaof.sweatflix.service.UserService;
import com.dohaof.sweatflix.vo.UserVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService; // 直接注入真实服务

    @Autowired
    private LoginInterceptor loginInterceptor; // 直接注入拦截器

    @TestConfiguration
    static class TestConfig {
        // 创建模拟对象
        @Bean
        @Primary
        public UserService userService() {
            return Mockito.mock(UserService.class);
        }

        @Bean
        @Primary
        public LoginInterceptor loginInterceptor() {
            return Mockito.mock(LoginInterceptor.class);
        }
    }

    @BeforeEach
    void setup() {
        // 初始化模拟对象行为
        when(loginInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }
    //这里主要测试拦截器连接，之后就不测了
    @Test
    void testGetUser() throws Exception {
        // 准备模拟数据
        UserVO mockUser = new UserVO();
        mockUser.setId(1);

        // 配置服务行为
        when(userService.getUser(1)).thenReturn(mockUser);

        // 执行测试（使用相对路径）
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }
}
