package com.ottogi.be.chat.event;

import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.domain.enums.MessageType;
import com.ottogi.be.chat.repository.ChatMessageRepository;
import com.ottogi.be.common.constants.AdminConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class EnterMeetingChatRoomEventListener {

    private final ChatMessageRepository chatMessageRepository;

    @EventListener
    public void handleMeetingChatRoomEnter(EnterMeetingChatRoomEvent event) {
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoomId(event.getChatRoomId())
                .message(event.getNickname() + "님이 입장하셨습니다.")
                .senderId(AdminConstants.ADMIN_ID)
                .sentAt(LocalDateTime.now())
                .messageType(MessageType.NOTICE)
                .build();

        chatMessageRepository.save(chatMessage);
    }
}
