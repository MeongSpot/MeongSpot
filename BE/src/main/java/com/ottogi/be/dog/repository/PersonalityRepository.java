package com.ottogi.be.dog.repository;

import com.ottogi.be.dog.domain.Personality;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalityRepository extends JpaRepository<Personality, Long> {
}
