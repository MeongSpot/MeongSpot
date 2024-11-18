package com.ottogi.be.walking.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
@RequiredArgsConstructor
public class WalkingRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveStartTime(String loginId, Long startTime) {
        String key = "walking:" + loginId + ":startTime";
        redisTemplate.opsForValue().set(key, startTime);
    }

    public void saveDogIds(String loginId, List<Long> dogIds) {
        String key = "walking:" + loginId + ":dogIds";
        for(Long dogId : dogIds) {
            redisTemplate.opsForList().rightPush(key, dogId);
        }

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
        System.out.println(loginId+"!!!!!!!!!!!!!!!!!");
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public void deleteWalkingData(String loginId) {
        redisTemplate.delete("walking:" + loginId + ":startTime");
        redisTemplate.delete("walking:" + loginId + ":dogIds");
        redisTemplate.delete("walking:" + loginId + ":gps");
    }
}