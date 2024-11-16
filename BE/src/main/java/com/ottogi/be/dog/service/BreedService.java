package com.ottogi.be.dog.service;

import com.ottogi.be.dog.repository.BreedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BreedService {

    private final BreedRepository breedRepository;

    @Transactional(readOnly = true)
    public List<String> findBreedList() {
        return breedRepository.findAllBreedName();
    }

    @Transactional(readOnly = true)
    public List<String> findBreed(String keyword) {
        return breedRepository.findBreedByKeyword(keyword);
    }
}
