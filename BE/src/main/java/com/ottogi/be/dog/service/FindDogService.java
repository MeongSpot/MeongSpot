package com.ottogi.be.dog.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.dto.response.FindDogNameResponse;
import com.ottogi.be.dog.dto.response.FindDogResponse;
import com.ottogi.be.dog.exception.DogNotFoundException;
import com.ottogi.be.dog.repository.DogPersonalityRepository;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FindDogService {

    private final DogRepository dogRepository;
    private final MemberRepository memberRepository;
    private final DogPersonalityRepository dogPersonalityRepository;

    @Transactional(readOnly = true)
    public List<FindDogResponse> findMyDogList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        return findDogWithPersonality(member);
    }

    @Transactional(readOnly = true)
    public List<FindDogResponse> findMemberDogList(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        return findDogWithPersonality(member);
    }

    @Transactional(readOnly = true)
    public List<FindDogResponse> findDogWithPersonality(Member member) {
        List<Dog> dogs = dogRepository.findByMember(member);
        List<FindDogResponse> result = new ArrayList<>();
        for (Dog dog : dogs) {
            List<String> personality = dogPersonalityRepository.findPersonalityByDog(dog);
            result.add(FindDogResponse.of(dog, personality));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<FindDogNameResponse> findDogNameList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        return dogRepository.findDogNameByMember(member);
    }

    @Transactional(readOnly = true)
    public FindDogResponse findDog(Long dogId) {
        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(DogNotFoundException::new);
        List<String> personality = dogPersonalityRepository.findPersonalityByDog(dog);
        return FindDogResponse.of(dog, personality);
    }
}
