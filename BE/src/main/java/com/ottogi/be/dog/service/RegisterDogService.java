package com.ottogi.be.dog.service;

import com.ottogi.be.common.dto.UploadProfileImageDto;
import com.ottogi.be.common.infra.AwsS3Service;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.dto.DogAddDto;
import com.ottogi.be.dog.dto.DogModifyDto;
import com.ottogi.be.dog.dto.SaveDogPersonalityDto;
import com.ottogi.be.dog.exception.DogImageUploadException;
import com.ottogi.be.dog.exception.DogNotFoundException;
import com.ottogi.be.dog.exception.DogOwnerMismatchException;
import com.ottogi.be.dog.repository.DogPersonalityRepository;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
@RequiredArgsConstructor
public class RegisterDogService {

    private final AwsS3Service awsS3Service;
    private final MemberRepository memberRepository;
    private final DogRepository dogRepository;
    private final DogPersonalityRepository dogPersonalityRepository;
    private final SavePersonalityService savePersonalityService;

    @Transactional
    public void addDog(DogAddDto dogAddDto) throws IOException {
        if (dogAddDto.getProfileImage().isEmpty()) throw new DogImageUploadException();

        String imagePath = awsS3Service.uploadFile(dogAddDto.getProfileImage());

        Member member = memberRepository.findByLoginId(dogAddDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Dog dog = dogAddDto.toEntity(imagePath, member);
        dogRepository.save(dog);

        savePersonalityService.saveDogPersonality(new SaveDogPersonalityDto(dog, dogAddDto.getPersonality()));
        member.beOwner();
    }

    @Transactional
    public void modifyDog(DogModifyDto dogModifyDto) throws URISyntaxException, IOException {
        Member member = memberRepository.findByLoginId(dogModifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Dog dog = dogRepository.findById(dogModifyDto.getDogId())
                .orElseThrow(DogNotFoundException::new);

        if (!dog.getMember().equals(member)) throw new DogOwnerMismatchException();

        String imagePath = awsS3Service.uploadDogProfileImage(new UploadProfileImageDto(dog.getProfileImage(), dogModifyDto.getProfileImage()));

        dog.updateInformation(
                imagePath, dogModifyDto.getName(), dogModifyDto.getBreed(), dogModifyDto.getSize(),
                dogModifyDto.getAge(), dogModifyDto.getGender(), dogModifyDto.getIsNeuter(), dogModifyDto.getBirth(), dogModifyDto.getIntroduction()
        );

        dogPersonalityRepository.deleteByDog(dog);

        savePersonalityService.saveDogPersonality(new SaveDogPersonalityDto(dog, dogModifyDto.getPersonality()));

    }

}
