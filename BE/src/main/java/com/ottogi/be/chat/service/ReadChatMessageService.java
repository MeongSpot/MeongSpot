package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.dto.ReadMessageDto;
import com.ottogi.be.chat.exception.ChatRoomNotFoundException;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReadChatMessageService {

    private final MemberRepository memberRepository;
    private final ChatMemberRepository chatMemberRepository;

    @Transactional
    public void readChatMessage(ReadMessageDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        ChatMember chatMember = chatMemberRepository.findByChatRoomIdAndMyId(dto.getChatRoomId(), member.getId())
                .orElseThrow(ChatRoomNotFoundException::new);

        chatMember.updateReadAt();
    }
}
