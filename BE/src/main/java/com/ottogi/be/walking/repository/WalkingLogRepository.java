package com.ottogi.be.walking.repository;

import com.ottogi.be.walking.domain.WalkingLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkingLogRepository extends JpaRepository<WalkingLog, Long> {

}
