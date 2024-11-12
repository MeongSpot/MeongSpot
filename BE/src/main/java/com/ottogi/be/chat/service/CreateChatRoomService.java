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
import java.util.Optional;

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

        Optional<ChatRoom> chatMember = chatMemberRepository.findChatRoomByMyIdAndInterlocutorId(member.getId(), interlocutor.getId());

        if (chatMember.isPresent()) return chatMember.get().getId();

        ChatRoom chatRoom = new ChatRoom(ChatRoomType.PERSONAL);

        chatRoomRepository.saveAndFlush(chatRoom);

        List<ChatMember> chatMembers = List.of(new ChatMember(chatRoom, member), new ChatMember(chatRoom, interlocutor));
        chatMemberRepository.saveAll(chatMembers);

        return chatRoom.getId();
    }
}
