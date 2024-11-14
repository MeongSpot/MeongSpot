package com.ottogi.be.auth.controller;

import com.ottogi.be.auth.dto.request.SendPhoneAuthCodeRequest;
import com.ottogi.be.auth.dto.request.VerifyPhoneAuthCodeRequest;
import com.ottogi.be.auth.service.JwtService;
import com.ottogi.be.auth.service.PhoneAuthService;
import com.ottogi.be.auth.util.JwtUtil;
import com.ottogi.be.common.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final PhoneAuthService phoneAuthService;
    private final JwtService jwtService;

    @PostMapping("/phone/send-auth-code")
    public ResponseEntity<?> authCodeSend(@Valid @RequestBody SendPhoneAuthCodeRequest request) {
        phoneAuthService.sendAuthCode(request);
        return ResponseEntity.ok(new ApiResponse<>("AU101", "전화번호 인증 코드 전송 성공", null));
    }

    @PostMapping("/phone/verify-auth-code")
    public ResponseEntity<?> authCodeVerify(@Valid @RequestBody VerifyPhoneAuthCodeRequest request) {
        String uuid = phoneAuthService.verifyAuthCode(request);
        return ResponseEntity.ok(new ApiResponse<>("AU102", "전화번호 인증 성공", uuid));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> accessReissue(HttpServletRequest request, HttpServletResponse response) {
        jwtService.reissueAccess(request, response);
        return ResponseEntity.ok(new ApiResponse<>("AU103", "엑세스 토큰 재발급 성공", null));
    }
}
