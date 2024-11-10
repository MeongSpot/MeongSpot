package com.ottogi.be.walking.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class WalkingRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveStartTime(Long userId, Long startTime) {
        String key = "walking:" + userId + ":startTime";
        redisTemplate.opsForValue().set(key, startTime);
    }

    public void saveDogIds(Long userId, List<Long> dogIds) {
        String key = "walking:" + userId + ":dogIds";
        redisTemplate.opsForList().rightPushAll(key, dogIds);
    }

    public Long getStartTime(Long userId) {
        String key = "walking:" + userId + ":startTime";
        Object value = redisTemplate.opsForValue().get(key);
        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }
        return (Long) value;
    }

    public List<Object> getGpsData(Long userId) {
        String key = "walking:" + userId + ":gps";
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public List<Object> getDogIds(Long userId) {
        String key = "walking:" + userId + ":dogIds";
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public void deleteWalkingData(Long userId) {
        redisTemplate.delete("walking:" + userId + ":startTime");
        redisTemplate.delete("walking:" + userId + ":dogIds");
        redisTemplate.delete("walking:" + userId + ":gps");
    }
}