package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.domain.enums.ChatRoomType;
import com.ottogi.be.chat.dto.LeaveMeetingChatRoomDto;
import com.ottogi.be.chat.dto.LeavePersonalChatRoomDto;
import com.ottogi.be.chat.event.LeaveMeetingChatRoomEvent;
import com.ottogi.be.chat.exception.ChatRoomNotFoundException;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class LeaveChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MemberRepository memberRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void leavePersonalChatRoom(LeavePersonalChatRoomDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(ChatRoomNotFoundException::new);

        if (chatRoom.getChatRoomType() != ChatRoomType.PERSONAL) throw new ChatRoomNotFoundException();

        ChatMember chatMember = chatMemberRepository.findByChatRoomIdAndMyId(chatRoom.getId(), member.getId())
                .orElseThrow(ChatRoomNotFoundException::new);

        chatMember.updateLeftAt();
    }

    @Transactional
    public void leaveMeetingChatRoom(LeaveMeetingChatRoomDto dto) {
        ChatMember chatMember = chatMemberRepository.findByChatRoomIdAndMyId(dto.getChatRoomId(), dto.getMemberId())
                .orElseThrow(ChatRoomNotFoundException::new);

        chatMemberRepository.delete(chatMember);

        eventPublisher.publishEvent(new LeaveMeetingChatRoomEvent(dto.getChatRoomId(), dto.getNickname()));
    }
}
