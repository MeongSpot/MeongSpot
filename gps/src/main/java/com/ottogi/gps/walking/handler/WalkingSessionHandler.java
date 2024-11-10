package com.ottogi.gps.walking.handler;

import com.ottogi.gps.walking.repository.WalkingRedisRepository;

import lombok.extern.slf4j.Slf4j;
//import net.minidev.json.parser.JSONParser;
//import net.minidev.json.JSONObject;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


@Slf4j
@Component
public class WalkingSessionHandler extends TextWebSocketHandler {

    private final WalkingRedisRepository walkingRedisRepository;
    private static final Logger logger = LoggerFactory.getLogger(WalkingSessionHandler.class);


    public WalkingSessionHandler(WalkingRedisRepository walkingRedisRepository) {
        this.walkingRedisRepository = walkingRedisRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.info("WebSocket connection established with session ID: {}", session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        logger.info("Received new WebSocket message: {}", message.getPayload());

        try {
//            JSONParser jsonParser = new JSONParser();
//            Object obj = jsonParser.parse(message.getPayload());
//            JSONObject jsonObject = (JSONObject) obj;
            JSONObject jsonObject = new JSONObject(message.getPayload());

            Long userId = jsonObject.getLong("userId");
            double latitude = jsonObject.getDouble("lat");
            double longitude = jsonObject.getDouble("lng");

            logger.info("Parsed data - userId: {}, latitude: {}, longitude: {}", userId, latitude, longitude);

            walkingRedisRepository.saveGpsData(userId, latitude, longitude);
            logger.info("GPS data saved in Redis for userId: {}", userId);

        } catch (Exception e) {
            logger.error("Error processing WebSocket message: {}", message.getPayload(), e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("WebSocket connection closed. Session ID: {}, Close Status: {}", session.getId(), status);
    }

}
