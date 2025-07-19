package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.configure.LoginInterceptor;
import com.dohaof.sweatflix.controller.CommentsController;
import com.dohaof.sweatflix.dto.CommentsDTO;
import com.dohaof.sweatflix.service.CommentsService;
import com.dohaof.sweatflix.service.NoticeService;
import com.dohaof.sweatflix.service.UserService;
import com.dohaof.sweatflix.util.TokenUtil;
import com.dohaof.sweatflix.vo.CommentsVO;
import com.dohaof.sweatflix.vo.UserVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CommentsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentsService commentsService;

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Autowired
    private TokenUtil tokenUtil; // 添加 TokenUtil 的模拟

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public CommentsService commentsService() {
            return Mockito.mock(CommentsService.class);
        }

        @Bean
        @Primary
        public NoticeService noticeService() {
            return Mockito.mock(NoticeService.class);
        }

        @Bean
        @Primary
        public TokenUtil tokenUtil() {
            return Mockito.mock(TokenUtil.class);
        }
        @Bean
        @Primary
        public LoginInterceptor loginInterceptor() {
            return Mockito.mock(LoginInterceptor.class);
        }
    }

    @BeforeEach
    void setup() {
        // 设置拦截器始终放行
        when(loginInterceptor.preHandle(any(HttpServletRequest.class), any(HttpServletResponse.class), any())).thenReturn(true);

        // 设置 TokenUtil 验证成功
        when(tokenUtil.verifyToken(anyString())).thenReturn(true);
        when(tokenUtil.getUserId(anyString())).thenReturn(123);
    }

    @Test
    void createComments_Success() throws Exception {
        CommentsDTO commentsDTO = new CommentsDTO();
        commentsDTO.setVenueId(1);
        commentsDTO.setContent("Great venue!");

        when(commentsService.addComments(any(CommentsDTO.class), eq(123)))
                .thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/comments")
                        .header("Authorization", "Bearer valid_token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentsDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void getComments_Success() throws Exception {
        CommentsVO commentsVO = new CommentsVO();
        commentsVO.setId(1);
        commentsVO.setContent("Nice place");
        List<CommentsVO> commentsList = Collections.singletonList(commentsVO);

        when(commentsService.getCommentsByVenueId(1))
                .thenReturn(commentsList);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/comments/1")
                        .header("Authorization", "Bearer valid_token")) // GET 请求也需要认证头
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].content").value("Nice place"));
    }

    @Test
    void thumbUp_Success() throws Exception {
        when(commentsService.addThumbUp(456))
                .thenReturn("Thumb up added");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/comments/thumbs/456")
                        .header("Authorization", "Bearer valid_token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value("Thumb up added"));

        verify(noticeService).NoticeThumbsUp(456, null);
    }

}