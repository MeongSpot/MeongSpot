package com.ottogi.be.dog.service;

import com.ottogi.be.common.infra.AwsS3Service;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.domain.DogPersonality;
import com.ottogi.be.dog.domain.Personality;
import com.ottogi.be.dog.dto.DogAddDto;
import com.ottogi.be.dog.dto.DogModifyDto;
import com.ottogi.be.dog.dto.response.DogListResponse;
import com.ottogi.be.dog.exception.DogImageUploadException;
import com.ottogi.be.dog.exception.DogNotFoundException;
import com.ottogi.be.dog.exception.DogOwnerMismatchException;
import com.ottogi.be.dog.exception.DogPersonalityNotFoundException;
import com.ottogi.be.dog.repository.DogPersonalityRepository;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.dog.repository.PersonalityRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DogService {

    private final AwsS3Service awsS3Service;
    private final MemberRepository memberRepository;
    private final DogRepository dogRepository;
    private final PersonalityRepository personalityRepository;
    private final DogPersonalityRepository dogPersonalityRepository;

    @Transactional
    public void addDog(DogAddDto dogAddDto) throws IOException {
        if (dogAddDto.getProfileImage().isEmpty()) throw new DogImageUploadException();

        String imagePath = awsS3Service.uploadFile(dogAddDto.getProfileImage());

        Member member = memberRepository.findByLoginId(dogAddDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Dog dog = dogAddDto.toEntity(imagePath, member);
        dogRepository.save(dog);

        List<Long> personalityList = dogAddDto.getPersonality();
        if (personalityList == null || personalityList.isEmpty()) throw new DogPersonalityNotFoundException();
        List<DogPersonality> pList = new ArrayList<>();
        for (Long p : personalityList) {
            Personality personality = personalityRepository.findById(p)
                    .orElseThrow(DogPersonalityNotFoundException::new);

            DogPersonality dogPersonality = DogPersonality.builder()
                    .dog(dog)
                    .personality(personality)
                    .build();

            pList.add(dogPersonality);
        }
        dogPersonalityRepository.saveAll(pList);
        member.beOwner();
    }

    @Transactional(readOnly = true)
    public List<DogListResponse> findDogList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        List<Dog> dogs = dogRepository.findByMember(member);
        List<DogListResponse> result = new ArrayList<>();
        for (Dog dog : dogs) {
            List<String> personality = dogPersonalityRepository.findPersonalityByDog(dog);
            DogListResponse dogListResponse = DogListResponse.builder()
                    .id(dog.getId())
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
            result.add(dogListResponse);
        }
        return result;
    }

    @Transactional
    public void modifyDog(DogModifyDto dogModifyDto) throws URISyntaxException, IOException {
        Member member = memberRepository.findByLoginId(dogModifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Dog dog = dogRepository.findById(dogModifyDto.getDogId())
                .orElseThrow(DogNotFoundException::new);

        if (!dog.getMember().equals(member)) throw new DogOwnerMismatchException();

        String imagePath = null;
        if (dogModifyDto.getProfileImage().isEmpty() || dogModifyDto.getProfileImage() == null) {
            imagePath = dog.getProfileImage();
        } else {
            awsS3Service.deleteFile(dog.getProfileImage());
            imagePath = awsS3Service.uploadFile(dogModifyDto.getProfileImage());
        }

        dog.updateInformation(
                imagePath, dogModifyDto.getName(), dogModifyDto.getBreed(), dogModifyDto.getSize(),
                dogModifyDto.getAge(), dogModifyDto.getGender(), dogModifyDto.getIsNeuter(), dogModifyDto.getBirth(), dogModifyDto.getIntroduction()
        );

        dogPersonalityRepository.deleteByDog(dog);

        List<Long> personalityList = dogModifyDto.getPersonality();
        if (personalityList == null || personalityList.isEmpty()) throw new DogPersonalityNotFoundException();
        List<DogPersonality> pList = new ArrayList<>();
        for (Long p : personalityList) {
            Personality personality = personalityRepository.findById(p)
                    .orElseThrow(DogPersonalityNotFoundException::new);

            DogPersonality dogPersonality = DogPersonality.builder()
                    .dog(dog)
                    .personality(personality)
                    .build();

            pList.add(dogPersonality);
        }
        dogPersonalityRepository.saveAll(pList);
    }

}
