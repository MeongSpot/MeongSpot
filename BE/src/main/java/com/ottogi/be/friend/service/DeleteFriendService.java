package com.ottogi.be.friend.service;

import com.ottogi.be.friend.dto.DeleteFriendDto;
import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteFriendService {

    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;

    @Transactional
    public void deleteFriend(DeleteFriendDto dto) {
        Member me = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        friendRepository.deleteByMyIdAndFriendId(me.getId(), dto.getFriendId());
    }
}
