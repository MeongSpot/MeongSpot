package com.ottogi.be.dog.repository;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.domain.DogPersonality;
import com.ottogi.be.dog.dto.MeetingDogPersonalityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DogPersonalityRepository extends JpaRepository<DogPersonality, Long> {
    @Query("""
            SELECT p.name
            FROM DogPersonality dp
            JOIN dp.personality p
            WHERE dp.dog = :dog
            """)
    List<String> findPersonalityByDog(Dog dog);

    void deleteByDog(Dog dog);

    @Query("""
            SELECT new com.ottogi.be.dog.dto.MeetingDogPersonalityDto(dp.dog.id, p.name)
            FROM DogPersonality dp
            JOIN dp.personality p
            WHERE dp.dog.id IN :dogIds
            """)
    List<MeetingDogPersonalityDto> findPersonalityByDogId(List<Long> dogIds);
}
