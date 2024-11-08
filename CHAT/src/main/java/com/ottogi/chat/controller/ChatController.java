package com.ottogi.chat.controller;

import com.ottogi.chat.dto.ChatMessageDto;
import com.ottogi.chat.dto.request.SendMessageRequest;
import com.ottogi.chat.service.SendMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class ChatController {

    private final RabbitTemplate rabbitTemplate;
    private final SendMessageService sendMessageService;

    private static final String CHAT_EXCHANGE_NAME = "chat.exchange";

    @MessageMapping("chat.enter.{chatRoomId}")
    public void enterChatRoom(@DestinationVariable Long chatRoomId) {

    }

    @MessageMapping("send.message.{chatRoomId}")
    public void messageSend(@Payload SendMessageRequest request, @DestinationVariable Long chatRoomId) {
        ChatMessageDto message = sendMessageService.sendMessage(request, chatRoomId);
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, message);
    }
}
