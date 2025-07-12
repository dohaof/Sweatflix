//package com.dohaof.sweatflix.controller;
//import com.dohaof.sweatflix.configure.LoginInterceptor;
//import com.dohaof.sweatflix.service.UserService;
//import com.dohaof.sweatflix.vo.UserVO;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.context.TestConfiguration;
//import org.springframework.context.annotation.Bean;
//import org.mockito.Mock;
//import org.springframework.context.annotation.Primary;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//class UserTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Mock
//    private UserService mockUserService;
//    @Mock
//    private LoginInterceptor loginInterceptor;
//    @TestConfiguration
//    static class TestConfig {
//        @Bean
//        @Primary
//        public UserService userService(UserService mock) {
//            return mock;
//        }
//    }
//
//    @Test
//    void testGetUser() throws Exception {
//        UserVO mockUser = new UserVO();
//        mockUser.setId(1);
//        when(mockUserService.getUser(1)).thenReturn(mockUser);
//        when(loginInterceptor.preHandle(any(), any(), any())).thenReturn(true);
//        mockMvc.perform(get("http://localhost:3001/api/users/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.id").value(1));
//    }
//}
