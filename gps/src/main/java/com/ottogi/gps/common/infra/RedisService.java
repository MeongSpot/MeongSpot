package com.ottogi.gps.common.infra;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void setData(String key, Object value, Long expiredTime) {
        redisTemplate.opsForValue().set(key, value, expiredTime, TimeUnit.MILLISECONDS);
    }

    public Object getData(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void setHashData(String key, String field, Object value, Long expiredTime) {
        redisTemplate.opsForHash().put(key, field, value);
        redisTemplate.expire(key, expiredTime, TimeUnit.MILLISECONDS);
    }

    public Object getHashData(String key, String field) {
        return redisTemplate.opsForHash().get(key, field);
    }

    public void deleteData(String key) {
        redisTemplate.delete(key);
    }
}
