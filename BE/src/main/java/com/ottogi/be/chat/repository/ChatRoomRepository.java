package com.ottogi.be.chat.repository;

import com.ottogi.be.chat.domain.ChatRoom;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Modifying
    @Query("""
        DELETE FROM ChatRoom cr WHERE cr.id IN :chatRoomIds
    """)
    void deleteAllByChatRoomIds(@Param("chatRoomIds") List<Long> chatRoomIds);
}
