package com.ottogi.be.auth.service;

import com.ottogi.be.auth.dto.request.SendPhoneAuthCodeRequest;
import com.ottogi.be.auth.dto.request.VerifyPhoneAuthCodeRequest;
import com.ottogi.be.auth.exception.PhoneVerificationFailedException;
import com.ottogi.be.common.constants.RedisExpiredTimeConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhoneAuthService {

    private final DefaultMessageService messageService;
    private final RedisService redisService;
    private final MemberRepository memberRepository;

    private static final String senderPhone = "01085914442";

    private String createCode() {
        int leftLimit = 48;
        int rightLimit = 122;
        int targetStringLength = 6;
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 | i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    public void sendAuthCode(SendPhoneAuthCodeRequest request) {
        String receiverPhone = request.getPhone();
        String authCode = createCode();
        Message message = new Message();
        message.setFrom(senderPhone);
        message.setTo(receiverPhone);
        message.setText(authCode);
        redisService.setData(RedisKeyConstants.PHONE_AUTH_CODE + receiverPhone, authCode, RedisExpiredTimeConstants.PHONE_AUTH_CODE_EXPIRED);

        messageService.sendOne(new SingleMessageSendingRequest(message));
    }

    public String verifyAuthCode(VerifyPhoneAuthCodeRequest request) {
        String issuedCode = (String) redisService.getData(RedisKeyConstants.PHONE_AUTH_CODE + request.getPhone());

        if (issuedCode == null || !issuedCode.equals(request.getAuthCode())) {
            throw new PhoneVerificationFailedException();
        }

        String uuid = UUID.randomUUID().toString();

        redisService.setData(RedisKeyConstants.PHONE_AUTH_VERIFIED + request.getPhone(), uuid, RedisExpiredTimeConstants.PHONE_AUTH_VERIFIED_EXPIRED);
        redisService.deleteData(RedisKeyConstants.PHONE_AUTH_CODE + request.getPhone());

        return uuid;
    }

}
