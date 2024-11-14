package com.ottogi.be.walking.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
@RequiredArgsConstructor
public class WalkingRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveStartTime(String loginId, Long startTime) {
        String key = "walking:" + loginId + ":startTime";
        redisTemplate.opsForValue().set(key, startTime);
    }

    public void saveDogIds(String loginId, List<Long> dogIds) {
        Set<Long> uniqueDogIds = new HashSet<>(dogIds);
        String key = "walking:" + loginId + ":dogIds";
        redisTemplate.opsForList().rightPushAll(key, uniqueDogIds);

//        String key = "walking:" + loginId + ":dogIds";
//        redisTemplate.opsForList().rightPushAll(key, dogIds);
    }

    public Long getStartTime(String loginId) {
        String key = "walking:" + loginId + ":startTime";
        Object value = redisTemplate.opsForValue().get(key);
        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }
        return (Long) value;
    }

    public List<Object> getGpsData(String loginId) {
        String key = "walking:" + loginId + ":gps";
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public List<Object> getDogIds(String loginId) {
        String key = "walking:" + loginId + ":dogIds";
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public void deleteWalkingData(String loginId) {
        redisTemplate.delete("walking:" + loginId + ":startTime");
        redisTemplate.delete("walking:" + loginId + ":dogIds");
        redisTemplate.delete("walking:" + loginId + ":gps");
    }
}