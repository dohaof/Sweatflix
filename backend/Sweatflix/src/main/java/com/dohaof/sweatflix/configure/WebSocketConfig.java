package com.dohaof.sweatflix.configure;

import com.dohaof.sweatflix.util.WBUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myWebSocketHandler(), "/ws")
                .setAllowedOrigins("*"); // 允许跨域
    }

    @Bean
    public WebSocketHandler myWebSocketHandler() {
        return new WBUtil(); // 自定义处理器
    }
}