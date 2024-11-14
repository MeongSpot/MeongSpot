package com.ottogi.be.dog.service;

import com.ottogi.be.dog.domain.Breed;
import com.ottogi.be.dog.repository.BreedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BreedService {

    private final BreedRepository breedRepository;

    @Transactional(readOnly = true)
    public List<String> findBreedList() {
        return breedRepository.findAll()
                .stream()
                .map(Breed::getName)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> findBreed(String keyword) {
        return breedRepository.findBreedByKeyword(keyword);
    }
}
