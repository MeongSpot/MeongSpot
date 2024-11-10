package com.ottogi.be.member.controller;

import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.member.dto.request.SignupRequest;
import com.ottogi.be.member.service.CheckInfoService;
import com.ottogi.be.member.service.SignupService;
import com.ottogi.be.member.validation.annotation.LoginId;
import com.ottogi.be.member.validation.annotation.Nickname;
import com.ottogi.be.member.validation.annotation.Phone;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final SignupService signupService;
    private final CheckInfoService checkInfoService;

    @PostMapping
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        signupService.signup(request);
        return new ResponseEntity<>(new ApiResponse<>("ME100", "회원가입 성공", null), HttpStatus.CREATED);
    }

    @GetMapping("/check-id")
    public ResponseEntity<?> idCheck(@LoginId @RequestParam("loginId") String loginId) {
        checkInfoService.checkId(loginId);
        return ResponseEntity.ok(new ApiResponse<>("ME101", "로그인 아이디 중복 검사 성공", null));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> nicknameCheck(@Nickname @RequestParam("nickname") String nickname) {
        checkInfoService.checkNickname(nickname);
        return ResponseEntity.ok(new ApiResponse<>("ME102", "닉네임 중복 검사 성공", null));
    }

    @GetMapping("/check-phone")
    public ResponseEntity<?> phoneCheck(@Phone @RequestParam("phone") String phone) {
        checkInfoService.checkPhone(phone);
        return ResponseEntity.ok(new ApiResponse<>("ME103", "전화번호 중복 검사 성공", null));
    }

}
