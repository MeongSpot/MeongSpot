package com.ottogi.be.dog.service;

import com.ottogi.be.dog.domain.DogPersonality;
import com.ottogi.be.dog.domain.Personality;
import com.ottogi.be.dog.dto.SaveDogPersonalityDto;
import com.ottogi.be.dog.exception.DogPersonalityNotFoundException;
import com.ottogi.be.dog.repository.DogPersonalityRepository;
import com.ottogi.be.dog.repository.PersonalityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavePersonalityService {

    private final PersonalityRepository personalityRepository;
    private final DogPersonalityRepository dogPersonalityRepository;

    @Transactional
    public void saveDogPersonality(SaveDogPersonalityDto dto) {
        List<Long> personalityIdList = dto.getPersonalityIdList();
        if (personalityIdList == null || personalityIdList.isEmpty()) throw new DogPersonalityNotFoundException();

        List<Personality> personalityList = personalityRepository.findAllById(personalityIdList);
        List<DogPersonality> dogPersonalityList = new ArrayList<>();

        for (Personality personality : personalityList) {
            dogPersonalityList.add(new DogPersonality(dto.getDog(), personality));
        }

        dogPersonalityRepository.saveAll(dogPersonalityList);
    }

}
