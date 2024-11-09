package com.ottogi.chat.repository;

import com.ottogi.chat.domain.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    Optional<ChatMember> findByMemberIdAndChatRoomId(Long memberId, Long chatRoomId);
}
