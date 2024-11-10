package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.domain.enums.ChatRoomType;
import com.ottogi.be.chat.dto.CreateFriendChatRoomDto;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.friend.exception.FriendRelationShipNotFoundException;
import com.ottogi.be.friend.repository.FriendRepository;
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
    private final FriendRepository friendRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long addFriendChatRoom(CreateFriendChatRoomDto dto) {

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Member friend = memberRepository.findById(dto.getFriendId())
                .orElseThrow(MemberNotFoundException::new);

        if (chatMemberRepository.findChatRoomByMyIdAndFriendId(member.getId(), friend.getId()).isPresent()) {
            return chatMemberRepository.findChatRoomByMyIdAndFriendId(member.getId(), friend.getId()).get().getId();
        }

        if (!friendRepository.isFriend(member.getId(), friend.getId())) {
            throw new FriendRelationShipNotFoundException();
        }

        ChatRoom chatRoom = ChatRoom.builder()
                .chatRoomType(ChatRoomType.FRIEND)
                .build();

        chatRoomRepository.saveAndFlush(chatRoom);

        List<ChatMember> chatMembers = List.of(
                new ChatMember(chatRoom, member),
                new ChatMember(chatRoom, friend)
        );
        chatMemberRepository.saveAll(chatMembers);

        return chatRoom.getId();
    }
}
