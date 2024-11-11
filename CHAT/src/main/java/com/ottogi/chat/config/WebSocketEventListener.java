package com.ottogi.chat.config;

import com.ottogi.chat.service.UpdateReadAtService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener implements ApplicationListener<SessionDisconnectEvent> {

    private final UpdateReadAtService updateReadAtService;

    @Override
    public void onApplicationEvent(@NonNull SessionDisconnectEvent event) {

        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());

        Long memberId = (Long) headerAccessor.getSessionAttributes().get("memberId");
        Long chatRoomId = (Long) headerAccessor.getSessionAttributes().get("chatRoomId");

        if (memberId != null && chatRoomId != null) {
            updateReadAtService.updateReadAt(memberId, chatRoomId);
        }

    }
}
