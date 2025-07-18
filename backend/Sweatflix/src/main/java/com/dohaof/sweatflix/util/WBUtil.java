package com.dohaof.sweatflix.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Component
public class WBUtil extends TextWebSocketHandler {
    // 统一使用一个会话映射
    @Autowired
    private TokenUtil tokenUtil;
    private static final Map<String, WebSocketSession> allSessions = new ConcurrentHashMap<>();
    private static final Map<Integer, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        allSessions.put(session.getId(), session);
        System.out.println("新连接: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 连接关闭时清理
        allSessions.remove(session.getId());
        Integer userId = (Integer) session.getAttributes().get("userId");
        if (userId != null) {
            userSessions.remove(userId);
        }
        System.out.println("终止" + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JsonNode json = new ObjectMapper().readTree(message.getPayload());
            String msgType = json.get("type").asText();

            if ("AUTHENTICATE".equals(msgType)) {
                handleAuthentication(session, json);
            } else {
                // 添加默认消息处理
                session.sendMessage(new TextMessage("{\"type\":\"UNSUPPORTED\"}"));
            }
        } catch (Exception e) {
            try {
                session.sendMessage(new TextMessage("{\"type\":\"INVALID_FORMAT\"}"));
            } catch (IOException ex) {
                System.err.println("错误响应失败: " + ex.getMessage());
            }
        }
    }

    private void handleAuthentication(WebSocketSession session, JsonNode json) throws IOException {
        String token = json.get("token").asText();
        if (tokenUtil.verifyToken(token)) {
            Integer userId = tokenUtil.getUserId(token);
            session.getAttributes().put("userId", userId);
            userSessions.put(userId, session);
            session.sendMessage(new TextMessage("{\"type\":\"AUTH_SUCCESS\"}"));
            System.out.println("认证成功" + session.getId());
        } else {
            session.sendMessage(new TextMessage("{\"type\":\"AUTH_FAILED\"}"));
            session.close();
        }
    }

    // 改进的广播方法
    public void broadcast(String message) {
        allSessions.values().removeIf(session -> !session.isOpen()); // 先清理无效会话

        allSessions.values().forEach(session -> {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                System.err.println("广播失败: " + e.getMessage());
            }
        });
    }
    public void sendToSession(WebSocketSession session, String message) {
        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            System.err.println("发送消息失败: " + e.getMessage());
        }
    }

    // 点对点发送
    public void sendToUser(Integer userId, String message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            sendToSession(session, message);
        } else {
            System.out.println("用户 " + userId + " 不在线");
            // 可以添加离线消息存储逻辑
        }
    }

    // 添加多设备支持
    public void sendToAllUserDevices(Integer userId, String message) {
        allSessions.values().stream()
                .filter(session ->
                        userId.equals(session.getAttributes().get("userId")) &&
                                session.isOpen()
                )
                .forEach(session -> sendToSession(session, message));
    }
}

