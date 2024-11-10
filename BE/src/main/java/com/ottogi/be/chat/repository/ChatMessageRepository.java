package com.ottogi.be.chat.repository;

import com.ottogi.be.chat.domain.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    ChatMessage findFirstByChatRoomIdOrderBySentAtDesc(Long chatRoomId);

    List<ChatMessage> findAllByChatRoomIdOrderBySentAtDesc(Long chatRoomId, Pageable pageable);
}
