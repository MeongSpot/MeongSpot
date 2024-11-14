package com.ottogi.be.chat.repository;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.dto.PersonalChatInfoDto;
import com.ottogi.be.member.domain.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {

    @Query("""
        SELECT cm1.chatRoom
        FROM ChatMember cm1
        JOIN ChatMember cm2 ON cm1.chatRoom.id = cm2.chatRoom.id
        WHERE cm1.member.id = :myId AND cm2.member.id = :interlocutorId AND cm1.chatRoom.chatRoomType = 'PERSONAL'
        ORDER BY cm1.chatRoom.id ASC
    """)
    Optional<ChatRoom> findChatRoomByMyIdAndInterlocutorId(@Param("myId") Long myId, @Param("interlocutorId") Long interlocutorId);

    @Query("""
        SELECT cm
        FROM ChatMember cm
        WHERE cm.chatRoom.id = :chatRoomId AND cm.member.id = :myId
    """)
    Optional<ChatMember> findByChatRoomIdAndMyId(@Param("chatRoomId") Long chatRoomId, @Param("myId") Long myId);

    @Query("""
        SELECT new com.ottogi.be.chat.dto.PersonalChatInfoDto(
            cm.chatRoom.id, interlocutor.member.nickname, interlocutor.member.profileImage, cm.readAt, cm.leftAt
        )
        FROM ChatMember cm
        JOIN ChatMember interlocutor ON interlocutor.chatRoom.id = cm.chatRoom.id AND interlocutor.member.id <> :memberId
        WHERE cm.member.id = :memberId AND cm.chatRoom.chatRoomType = 'PERSONAL'
    """)
    List<PersonalChatInfoDto> findAllPersonalChatRoomByMemberId(@Param("memberId") Long memberId);

    @Query("""
        SELECT cm
        FROM ChatMember cm
        JOIN FETCH cm.member
        WHERE cm.chatRoom.id = :chatRoomId
    """)
    List<ChatMember> findMemberByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
