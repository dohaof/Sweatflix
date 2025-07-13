package com.dohaof.sweatflix.configure;//package com.dohaof.sweatflix.configure;
//
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 这个类定制了一个登录的拦截器，
 * SpringBoot的拦截器标准为HandlerInterceptor接口，
 * 这个类实现了这个接口，表示是SpringBoot标准下的，
 * 在preHandle方法中，通过获取请求头Header中的token，
 * 判断了token是否合法，如果不合法则抛异常，
 * 合法则将用户信息存储到request的session中。
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Autowired
    TokenUtil tokenUtil;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("Authorization"); // 标准头

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // 去掉"Bearer "
            if (tokenUtil.verifyToken(token)) {
                // 只存用户ID到请求属性
                request.setAttribute("userId", tokenUtil.getUserId(token));
                return true;
            }
        }
        System.out.println("拦截路径:"+request.getRequestURI());
        throw new SFException("401","拦截路径");
    }

}
