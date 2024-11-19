package com.ottogi.be.friend.repository;

import com.ottogi.be.friend.domain.Friend;
import com.ottogi.be.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    @Query("""
        SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END
        FROM Friend f
        WHERE (f.sender.id = :myId AND f.receiver.id = :friendId)
        OR (f.sender.id = :friendId AND f.receiver.id = :myId)
    """)
    Boolean isFriend(@Param("myId") Long myId, @Param("friendId") Long friendId);

    @Query(value = """
            (SELECT f.sender_id
            FROM friend f
            WHERE f.receiver_id = :memberId)
            UNION
            (SELECT f.receiver_id
            FROM friend f
            WHERE f.sender_id = :memberId)
            """, nativeQuery = true)
    List<Long> findFriendByMemberId(@Param("memberId") Long memberId);

    @Query(value = """
        (SELECT m.id
        FROM friend f
        JOIN member m ON f.sender_id = m.id
        WHERE f.receiver_id = :memberId
          AND m.nickname LIKE %:keyword%
        ORDER BY CASE
        WHEN m.nickname LIKE :keyword THEN 0
        WHEN m.nickname LIKE :keyword% THEN 1
        WHEN m.nickname LIKE %:keyword THEN 2
        WHEN m.nickname LIKE %:keyword% THEN 3
        END)
        UNION
        (SELECT m.id
        FROM friend f
        JOIN member m ON f.receiver_id = m.id
        WHERE f.sender_id = :memberId
          AND m.nickname LIKE %:keyword%
        ORDER BY CASE
        WHEN m.nickname LIKE :keyword THEN 0
        WHEN m.nickname LIKE :keyword% THEN 1
        WHEN m.nickname LIKE %:keyword THEN 2
        WHEN m.nickname LIKE %:keyword% THEN 3
        END)
        """, nativeQuery = true)
    List<Long> findFriendsByNickname(@Param("memberId") Long memberId, @Param("keyword") String keyword);

    boolean existsBySenderAndReceiver(Member sender, Member receiver);

    @Modifying
    @Query("""
            DELETE
            FROM Friend f
            WHERE (f.sender.id = :myId AND f.receiver.id = :friendId)
            OR (f.sender.id = :friendId AND f.receiver.id = :myId)
            """)
    void deleteByMyIdAndFriendId(Long myId, Long friendId);

    @Query(
            """
            SELECT f.receiver FROM Friend f WHERE f.sender = :member
            UNION
            SELECT f.sender FROM Friend f WHERE f.receiver = :member
            """
    )
    List<Member> findAllFriends(Member member);

}
