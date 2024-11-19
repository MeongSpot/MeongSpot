package com.ottogi.be.dog.repository;

import com.ottogi.be.dog.domain.Personality;
import com.ottogi.be.dog.dto.response.PersonalityResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PersonalityRepository extends JpaRepository<Personality, Long> {

    @Query("""
            SELECT NEW com.ottogi.be.dog.dto.response.PersonalityResponse(p.id, p.name)
            FROM Personality p
            """)
    List<PersonalityResponse> findAllPersonalityName();
}
