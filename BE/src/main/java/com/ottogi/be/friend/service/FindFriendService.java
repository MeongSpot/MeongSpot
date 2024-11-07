package com.ottogi.be.friend.service;

import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.friend.dto.FriendDetailsDto;
import com.ottogi.be.friend.dto.FriendDto;
import com.ottogi.be.friend.dto.SearchFriendDto;
import com.ottogi.be.friend.dto.response.FriendDetailsResponse;
import com.ottogi.be.friend.dto.response.FriendResponse;
import com.ottogi.be.friend.exception.FriendRelationShipNotFoundException;
import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindFriendService {

    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;
    private final DogRepository dogRepository;

    @Transactional(readOnly = true)
    public List<FriendResponse> findFriendList(String longinId) {
        Member member = memberRepository.findByLoginId(longinId)
                .orElseThrow(MemberNotFoundException::new);

        List<Long> ids = friendRepository.findFriendByMemberId(member.getId());
        List<FriendDto> friends = dogRepository.findAllByMemberId(ids);

        Map<Long, List<FriendDto>> groupById = friends.stream().collect(Collectors.groupingBy(FriendDto::getId));

        List<FriendResponse> friendResponse = new ArrayList<>();

        for (Map.Entry<Long, List<FriendDto>> entry : groupById.entrySet()) {
            Long id = entry.getKey();
            List<FriendDto> dtos = entry.getValue();
            List<String> dogNames = dtos.stream()
                    .map(FriendDto::getDogName)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            FriendResponse friend = FriendResponse.builder()
                    .id(id)
                    .profileImage(dtos.get(0).getProfileImage())
                    .nickname(dtos.get(0).getNickname())
                    .dogNames(dogNames)
                    .build();

            friendResponse.add(friend);
        }
        return friendResponse;
    }

    @Transactional(readOnly = true)
    public FriendDetailsResponse findFriendDetails(FriendDetailsDto friendDetailsDto) {
        Member member = memberRepository.findByLoginId(friendDetailsDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        if (!friendRepository.isFriend(member.getId(), friendDetailsDto.getId())) throw new FriendRelationShipNotFoundException();
        Member friend = memberRepository.findById(friendDetailsDto.getId())
                .orElseThrow(MemberNotFoundException::new);
        LocalDate currentDate = LocalDate.now();
        int age = currentDate.getYear() - friend.getBirth().getYear();
        return new FriendDetailsResponse(friend.getProfileImage(), friend.getNickname(), friend.getGender(), age);
    }

    @Transactional(readOnly = true)
    public List<FriendResponse> findFriend(SearchFriendDto searchFriendDto) {
        Member member = memberRepository.findByLoginId(searchFriendDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        List<Long> ids = friendRepository.findFriendsByNickname(member.getId(), searchFriendDto.getKeyword());
        List<FriendDto> friends = dogRepository.findAllByMemberId(ids);

        Map<Long, List<FriendDto>> groupById = friends.stream().collect(Collectors.groupingBy(FriendDto::getId));

        List<FriendResponse> friendResponse = new ArrayList<>();

        for (Map.Entry<Long, List<FriendDto>> entry : groupById.entrySet()) {
            Long id = entry.getKey();
            List<FriendDto> dtos = entry.getValue();
            List<String> dogNames = dtos.stream()
                    .map(FriendDto::getDogName)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            if (dogNames.isEmpty()) dogNames = Collections.emptyList();

            FriendResponse friend = FriendResponse.builder()
                    .id(id)
                    .profileImage(dtos.get(0).getProfileImage())
                    .nickname(dtos.get(0).getNickname())
                    .dogNames(dogNames)
                    .build();

            friendResponse.add(friend);
        }
        return friendResponse;
    }
}
