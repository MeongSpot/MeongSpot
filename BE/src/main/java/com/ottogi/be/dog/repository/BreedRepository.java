package com.ottogi.be.dog.repository;

import com.ottogi.be.dog.domain.Breed;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BreedRepository extends JpaRepository<Breed, Long> {

    @Query("SELECT br.name FROM Breed br")
    List<String> findAllBreedName();

    @Query("""
            SELECT br.name
            FROM Breed br
            WHERE br.name LIKE %:keyword%
            ORDER BY CASE
            WHEN br.name LIKE :keyword THEN 0
            WHEN br.name LIKE :keyword% THEN 1
            WHEN br.name LIKE %:keyword THEN 2
            WHEN br.name LIKE %:keyword% THEN 3
            END
            """)
    List<String> findBreedByKeyword(@Param("keyword") String keyword);
}
