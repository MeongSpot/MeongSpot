package com.ottogi.gps.walking.config;

import com.ottogi.gps.walking.handler.WalkingSessionHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final WalkingSessionHandler walkingSessionHandler;


    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(walkingSessionHandler, "/ws/location").setAllowedOrigins("*");
    }
}