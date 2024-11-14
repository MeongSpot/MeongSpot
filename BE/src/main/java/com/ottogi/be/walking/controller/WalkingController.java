package com.ottogi.be.walking.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.walking.dto.request.WalkingStartRequest;
import com.ottogi.be.walking.dto.response.WalkingLogDetailResponse;
import com.ottogi.be.walking.dto.response.WalkingLogResponse;
import com.ottogi.be.walking.service.WalkingEndService;
import com.ottogi.be.walking.service.WalkingLogService;
import com.ottogi.be.walking.service.WalkingStartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/walking-log")
@RequiredArgsConstructor
public class WalkingController {
    private final WalkingStartService walkingStartService;
    private final WalkingEndService walkingEndService;
    private final WalkingLogService walkingLogService;
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

    @GetMapping
    public ResponseEntity<?> walkingLogGet(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        WalkingLogResponse result = walkingLogService.findWalkingLog(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("WK103", "산책 조회 성공",result));
    }

    @GetMapping("/{walkingLogId}")
    public ResponseEntity<?> friendDogList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                           @PathVariable Long walkingLogId) {
        WalkingLogDetailResponse result = walkingLogService.findWalkingLogDetail(walkingLogId);
        return ResponseEntity.ok(new ApiResponse<>("WK104", "산책 기록 상세조회 성공", result));
    }

}
