package com.ottogi.be.chat.event;

import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.domain.enums.MessageType;
import com.ottogi.be.chat.repository.ChatMessageRepository;
import com.ottogi.be.common.constants.AdminConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class LeaveMeetingChatRoomEventListener {

    private static final String CHAT_EXCHANGE_NAME = "chat.exchange";

    private final ChatMessageRepository chatMessageRepository;
    private final RabbitTemplate rabbitTemplate;

    @EventListener
    public void handleMeetingChatRoomEnter(LeaveMeetingChatRoomEvent event) {
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoomId(event.getChatRoomId())
                .message(event.getNickname() + "님이 퇴장하셨습니다.")
                .senderId(AdminConstants.ADMIN_ID)
                .sentAt(LocalDateTime.now())
                .messageType(MessageType.NOTICE)
                .build();

        chatMessageRepository.save(chatMessage);
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + event.getChatRoomId(), chatMessage);
    }
}
