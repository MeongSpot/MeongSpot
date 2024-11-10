package com.ottogi.be.chat.repository;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {

    @Query("""
        SELECT cm
        FROM ChatMember cm
        JOIN FETCH cm.member m
        WHERE cm.chatRoom.id IN (
            SELECT cm2.chatRoom.id
            FROM ChatMember cm2
            WHERE cm2.member.loginId = :loginId
            AND cm2.chatRoom.chatRoomType = 'FRIEND'
        )
        AND cm.member.loginId <> :loginId
        ORDER BY cm.chatRoom.id ASC
    """)
    List<ChatMember> findAllChatFriendByLoginId(@Param("loginId") String loginId);

    @Query("""
        SELECT cm
        FROM ChatMember cm
        WHERE cm.member.loginId = :loginId AND cm.chatRoom.chatRoomType = 'FRIEND'
        ORDER BY cm.chatRoom.id ASC
    """)
    List<ChatMember> findAllFriendChatByLoginId(@Param("loginId") String loginId);

    @Query("""
        SELECT cm1.chatRoom
        FROM ChatMember cm1
        JOIN ChatMember cm2 ON cm1.chatRoom.id = cm2.chatRoom.id
        WHERE cm1.member.id = :myId AND cm2.member.id = :friendId AND cm1.chatRoom.chatRoomType = 'FRIEND'
        ORDER BY cm1.chatRoom.id ASC
    """)
    Optional<ChatRoom> findChatRoomByMyIdAndFriendId(@Param("myId") Long myId, @Param("friendId") Long friendId);

    @Query("""
        SELECT cm
        FROM ChatMember cm
        WHERE cm.chatRoom.id = :chatRoomId AND cm.member.id = :myId
    """)
    Optional<ChatMember> findByChatRoomIdAndMyId(@Param("chatRoomId") Long chatRoomId, @Param("myId") Long myId);
}
