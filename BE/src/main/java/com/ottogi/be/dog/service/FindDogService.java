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

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindDogService {

    private final DogRepository dogRepository;
    private final MemberRepository memberRepository;
    private final DogPersonalityRepository dogPersonalityRepository;

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
        return FindDogResponse.builder()
                .id(dogId)
                .name(dog.getName())
                .birth(dog.getBirth())
                .introduction(dog.getIntroduction())
                .gender(dog.getGender())
                .isNeuter(dog.getIsNeuter())
                .profileImage(dog.getProfileImage())
                .age(dog.getAge())
                .breed(dog.getBreed())
                .personality(personality)
                .build();
    }
}
