package com.dohaof.sweatflix.configure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 这个类的作用是配置拦截器。
 * addInterceptors方法配置了拦截器，
 * 添加了loginInterceptor作为拦截器，
 */
@Configuration
public class MyWebMvcConfig implements WebMvcConfigurer {
    @Autowired
    LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/users/login")
                .excludePathPatterns("/api/images")
                .excludePathPatterns("/error")
                .order(1);
    }

}
