package com.ottogi.be.walking.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.walking.dto.request.WalkingStartRequest;
import com.ottogi.be.walking.service.WalkingEndService;
import com.ottogi.be.walking.service.WalkingStartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/walking-log")
@RequiredArgsConstructor
public class WalkingController {
    private final WalkingStartService walkingStartService;
    private final WalkingEndService walkingEndService;

    @PostMapping("/start")
    public ResponseEntity<?> walkingStart(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                          @RequestBody WalkingStartRequest request){
        walkingStartService.startWalking(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("WK100", "산책 시작 성공",null));
    }

    @PostMapping("/end")
    public ResponseEntity<?> walkingEnd(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws JsonProcessingException {
        walkingEndService.endWalking(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("WK102", "산책 종료 성공",null));
    }


}
