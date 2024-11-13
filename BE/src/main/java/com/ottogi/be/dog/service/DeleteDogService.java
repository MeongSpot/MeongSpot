package com.ottogi.be.dog.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.dto.DeleteDogDto;
import com.ottogi.be.dog.exception.CannotDeleteDogException;
import com.ottogi.be.dog.exception.DogNotFoundException;
import com.ottogi.be.dog.exception.DogOwnerMismatchException;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.meeting.service.FindMeetingService;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteDogService {

    private final MemberRepository memberRepository;
    private final DogRepository dogRepository;
    private final FindMeetingService findMeetingService;

    @Transactional
    public void deleteDog(DeleteDogDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Dog dog = dogRepository.findById(dto.getDogId())
                .orElseThrow(DogNotFoundException::new);

        if (!dog.getMember().equals(member)) throw new DogOwnerMismatchException();

        if (findMeetingService.isParticipate(dog.getId())) throw new CannotDeleteDogException();

        dogRepository.deleteById(dog.getId());
    }
}
