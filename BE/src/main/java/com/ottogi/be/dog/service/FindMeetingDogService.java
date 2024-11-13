package com.ottogi.be.dog.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.dto.MeetingDogDto;
import com.ottogi.be.dog.dto.MeetingDogPersonalityDto;
import com.ottogi.be.dog.dto.response.FindDogProfileImage;
import com.ottogi.be.dog.dto.response.FindMeetingDogResponse;
import com.ottogi.be.dog.repository.DogPersonalityRepository;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindMeetingDogService {

    private final MeetingMemberRepository meetingMemberRepository;
    private final DogPersonalityRepository dogPersonalityRepository;

    @Transactional(readOnly = true)
    public List<FindDogProfileImage> findMeetingDogImageList(Long meetingId) {
        return meetingMemberRepository.findDogImageByMeetingId(meetingId);
    }

    @Transactional(readOnly = true)
    public List<FindMeetingDogResponse> findMeetingDogList(MeetingDogDto meetingDogDto) {
        List<Dog> dogs = meetingMemberRepository.findDogsFromMeetingIdAndMemberId(meetingDogDto.getMeetingId(), meetingDogDto.getMemberId());

        List<Long> dogIds = dogs.stream().map(Dog::getId).toList();

        List<MeetingDogPersonalityDto> personality = dogPersonalityRepository.findPersonalityByDogId(dogIds);
        Map<Long, List<String>> personalityMap = personality.stream()
                .collect(Collectors.groupingBy(MeetingDogPersonalityDto::getDogId, Collectors.mapping(MeetingDogPersonalityDto::getPersonality, Collectors.toList())));

        return dogs.stream()
                .map(dog -> FindMeetingDogResponse.builder()
                        .profileImage(dog.getProfileImage())
                        .name(dog.getName())
                        .breed(dog.getBreed())
                        .birth(dog.getBirth())
                        .age(dog.getAge())
                        .personality(personalityMap.get(dog.getId()))
                        .build())
                .collect(Collectors.toList());
    }
}
