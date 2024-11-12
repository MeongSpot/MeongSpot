package com.ottogi.chat.controller;

import com.ottogi.chat.constants.AdminConstants;
import com.ottogi.chat.domain.enums.MessageType;
import com.ottogi.chat.dto.ChatMessageDto;
import com.ottogi.chat.dto.EnterChatRoomDto;
import com.ottogi.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;


@RestController
@RequiredArgsConstructor
public class ChatController {

    private final RabbitTemplate rabbitTemplate;
    private final ChatMessageRepository chatMessageRepository;

    private static final String CHAT_EXCHANGE_NAME = "chat.exchange";
    private static final String CHAT_QUEUE_NAME = "chat.queue";

    @MessageMapping("enter.room.{chatRoomId}")
    public void enterRoom(@Payload EnterChatRoomDto request, @DestinationVariable Long chatRoomId) {
        ChatMessageDto dto = ChatMessageDto.builder()
                .chatRoomId(chatRoomId)
                .message(request.getNickname() + "님이 입장하셨습니다.")
                .senderId(AdminConstants.ADMIN_ID)
                .sentAt(LocalDateTime.now())
                .messageType(MessageType.NOTICE)
                .build();

        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, dto);
    }

    @MessageMapping("send.message.{chatRoomId}")
    public void messageSend(@Payload ChatMessageDto dto, @DestinationVariable Long chatRoomId) {
        dto.setChatRoomId(chatRoomId);
        dto.setSentAt(LocalDateTime.now());
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, dto);
    }

    @RabbitListener(queues = CHAT_QUEUE_NAME)
    public void receiveMessage(ChatMessageDto dto) {
        chatMessageRepository.save(dto.toEntity());
    }

}
