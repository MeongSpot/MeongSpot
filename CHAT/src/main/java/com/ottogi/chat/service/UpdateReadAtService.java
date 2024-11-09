package com.ottogi.chat.service;

import com.ottogi.chat.domain.ChatMember;
import com.ottogi.chat.repository.ChatMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateReadAtService {

    private final ChatMemberRepository chatMemberRepository;

    @Transactional
    public void updateReadAt(Long memberId, Long chatRoomId) {
        ChatMember chatMember = chatMemberRepository.findByMemberIdAndChatRoomId(memberId, chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("정보를 찾을 수 없습니다."));

        chatMember.updateReadAt();
    }
}
