package com.ottogi.chat.controller;

import com.ottogi.chat.dto.ChatMessageDto;
import com.ottogi.chat.dto.ConnectDto;
import com.ottogi.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;


@RestController
@RequiredArgsConstructor
public class ChatController {

    private final RabbitTemplate rabbitTemplate;
    private final ChatMessageRepository chatMessageRepository;

    private static final String CHAT_EXCHANGE_NAME = "chat.exchange";

    @MessageMapping("chat.info.{chatRoomId}")
    public void infoSave(@Payload ConnectDto dto, SimpMessageHeaderAccessor headerAccessor) {
        Long memberId = dto.getMemberId();
        Long chatRoomId = dto.getChatRoomId();

        headerAccessor.getSessionAttributes().put("memberId", memberId);
        headerAccessor.getSessionAttributes().put("chatRoomId", chatRoomId);
    }

    @MessageMapping("send.message.{chatRoomId}")
    public void messageSend(@Payload ChatMessageDto dto, @DestinationVariable Long chatRoomId) {
        dto.setChatRoomId(chatRoomId);
        dto.setSentAt(LocalDateTime.now());
        chatMessageRepository.save(dto.toEntity());
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, dto);
    }

}
