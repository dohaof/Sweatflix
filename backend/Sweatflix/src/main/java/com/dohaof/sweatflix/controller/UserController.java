package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.dto.AuthDTO;
import com.dohaof.sweatflix.dto.LoginResponseDTO;
import com.dohaof.sweatflix.dto.ModifyDTO;
import com.dohaof.sweatflix.dto.RegisterDTO;
import com.dohaof.sweatflix.service.NoticeService;
import com.dohaof.sweatflix.service.UserService;
import com.dohaof.sweatflix.util.TokenUtil;
import com.dohaof.sweatflix.vo.NoticeVO;
import com.dohaof.sweatflix.vo.Response;
import com.dohaof.sweatflix.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
        private final TokenUtil tokenUtil;
        private final UserService userService;
        private final NoticeService noticeService;
        /**
         * 获取用户详情
         */
        @GetMapping("/{userId}")
        public Response<UserVO> getUser(@PathVariable Integer userId) {
            return Response.buildSuccess(userService.getUser(userId));
        }
        /**
         * 创建新的用户
         */
        @PostMapping("/register")
        public Response<String> register(@RequestBody RegisterDTO registerDTO) {
            return Response.buildSuccess(userService.register(registerDTO));
        }

        /**
         * 更新用户信息
         */
        @PutMapping("")
        public Response<String> updateUser(@RequestBody ModifyDTO modifyDTO) {
            return Response.buildSuccess(userService.updateUser(modifyDTO));
        }

        /**
         * 登录
         */
        @PostMapping("/login")
        public Response<LoginResponseDTO> login(@RequestBody AuthDTO authDTO) {
            return Response.buildSuccess(userService.login(authDTO.getPhone(), authDTO.getPassword()));
        }
        @GetMapping("/notice")
        public Response<List<NoticeVO>> getNotice(HttpServletRequest request) {
                Integer userId= (Integer) request.getAttribute("userId");
                return Response.buildSuccess(noticeService.getNotice(userId));
        }
}

