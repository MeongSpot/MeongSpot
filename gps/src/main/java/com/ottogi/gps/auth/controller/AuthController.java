package com.ottogi.gps.auth.controller;

import com.ottogi.gps.auth.dto.request.SendPhoneAuthCodeRequest;
import com.ottogi.gps.auth.dto.request.VerifyPhoneAuthCodeRequest;
import com.ottogi.gps.auth.service.JwtService;
import com.ottogi.gps.common.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/refresh")
    public ResponseEntity<?> accessReissue(HttpServletRequest request, HttpServletResponse response) {
        jwtService.reissueAccess(request, response);
        return ResponseEntity.ok(new ApiResponse<>("AU103", "엑세스 토큰 재발급 성공", null));
    }
}
