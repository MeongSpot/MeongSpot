package com.ottogi.be.notification.service;

import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.notification.dto.FCMTokenDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.ottogi.be.common.constants.FcmTokenConstants.FCM_TOKEN_EXPIRED;

@Service
@RequiredArgsConstructor
public class FCMTokenService {
    private final RedisService redisService;

    @Transactional
    public void saveFcmToken(FCMTokenDto dto){
        redisService.setHashData(RedisKeyConstants.TOKEN+dto.getLoginId(), RedisFieldConstants.FCM, dto.getToken(),FCM_TOKEN_EXPIRED);
    }
}
