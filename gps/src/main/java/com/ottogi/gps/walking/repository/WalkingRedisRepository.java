package com.ottogi.gps.walking.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class WalkingRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveGpsData(String loginId, double lat, double lng) {
        String key = "walking:" + loginId + ":gps";
        redisTemplate.opsForList().rightPush(key, lat + "," + lng);
    }
}