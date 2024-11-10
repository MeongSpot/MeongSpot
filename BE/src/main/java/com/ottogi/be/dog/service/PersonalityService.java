package com.ottogi.be.dog.service;

import com.ottogi.be.dog.dto.response.PersonalityResponse;
import com.ottogi.be.dog.repository.PersonalityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonalityService {

    private final PersonalityRepository personalityRepository;

    @Transactional(readOnly = true)
    public List<PersonalityResponse> findPersonalityList() {

        return personalityRepository.findAll()
                .stream()
                .map(PersonalityResponse::from)
                .collect(Collectors.toList());
    }

}
