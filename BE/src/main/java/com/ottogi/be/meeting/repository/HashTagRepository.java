package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HashTagRepository extends JpaRepository<Hashtag, Long> {
}
