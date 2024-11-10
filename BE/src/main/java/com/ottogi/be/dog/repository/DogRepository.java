package com.ottogi.be.dog.repository;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DogRepository extends JpaRepository<Dog, Long> {
    @Query("SELECT d FROM Dog d WHERE d.member = :member")
    List<Dog> findByMember(Member member);
}
