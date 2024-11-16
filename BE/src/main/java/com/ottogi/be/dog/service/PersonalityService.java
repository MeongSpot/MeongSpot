package com.ottogi.be.dog.service;

import com.ottogi.be.dog.dto.response.PersonalityResponse;
import com.ottogi.be.dog.repository.PersonalityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalityService {

    private final PersonalityRepository personalityRepository;

    @Transactional(readOnly = true)
    public List<PersonalityResponse> findPersonalityList() {
        return personalityRepository.findAllPersonalityName();
    }

}
