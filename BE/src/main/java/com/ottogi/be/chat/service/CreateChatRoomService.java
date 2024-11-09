package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.domain.enums.ChatRoomType;
import com.ottogi.be.chat.dto.CreatePersonalChatRoomDto;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long addPersonalChatRoom(CreatePersonalChatRoomDto dto) {

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Member interlocutor = memberRepository.findById(dto.getInterlocutorId())
                .orElseThrow(MemberNotFoundException::new);

        if (chatMemberRepository.findChatRoomByMyIdAndInterlocutorId(member.getId(), interlocutor.getId()).isPresent()) {
            return chatMemberRepository.findChatRoomByMyIdAndInterlocutorId(member.getId(), interlocutor.getId()).get().getId();
        }

        ChatRoom chatRoom = ChatRoom.builder()
                .chatRoomType(ChatRoomType.PERSONAL)
                .build();

        chatRoomRepository.saveAndFlush(chatRoom);

        List<ChatMember> chatMembers = List.of(
                new ChatMember(chatRoom, member),
                new ChatMember(chatRoom, interlocutor)
        );
        chatMemberRepository.saveAll(chatMembers);

        return chatRoom.getId();
    }
}
