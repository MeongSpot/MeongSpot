package com.ottogi.be.meeting.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.meeting.dto.CreateMeetingDto;
import com.ottogi.be.meeting.dto.JoinMeetingDto;
import com.ottogi.be.meeting.dto.LeaveMeetingDto;
import com.ottogi.be.meeting.dto.MeetingDto;
import com.ottogi.be.meeting.dto.request.CreateMeetingRequest;
import com.ottogi.be.meeting.dto.request.JoinMeetingRequest;
import com.ottogi.be.meeting.dto.response.FindMeetingResponse;
import com.ottogi.be.meeting.dto.response.MeetingResponse;
import com.ottogi.be.meeting.dto.response.MeetingTopResponse;
import com.ottogi.be.meeting.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/meetings")
public class MeetingController {

    private final CreateMeetingService createMeetingService;
    private final JoinMeetingService joinMeetingService;
    private final FindMeetingService findMeetingService;
    private final FindHashtagService findHashtagService;
    private final LeaveMeetingService leaveMeetingService;

    @PostMapping
    public ResponseEntity<?> meetingAdd(@Valid @RequestBody CreateMeetingRequest createMeetingRequest,
                                        @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        createMeetingService.addMeeting(CreateMeetingDto.toDto(createMeetingRequest, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("MT100", "모임 생성 성공", null));
    }

    @PostMapping("/{meetingId}")
    public ResponseEntity<?> meetingJoin(@PathVariable Long meetingId,
                                         @Valid @RequestBody JoinMeetingRequest joinMeetingRequest,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws ExecutionException, InterruptedException {
        joinMeetingService.joinMeeting(JoinMeetingDto.toDto(meetingId, joinMeetingRequest, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("MT101", "모임 참여 성공", null));
    }

    @GetMapping
    public ResponseEntity<?> meetingList(@RequestParam String order,
                                         @RequestParam Long spotId) {
        List<MeetingResponse> result = findMeetingService.findMeetingList(new MeetingDto(order, spotId));
        return ResponseEntity.ok(new ApiResponse<>("MT102", "모임 전체 목록 조회 성공", result));
    }

    @GetMapping("/top")
    public ResponseEntity<?> meetingTopList(@RequestParam Long spotId) {
        MeetingTopResponse result = findMeetingService.findMeetingTopList(spotId);
        return ResponseEntity.ok(new ApiResponse<>("MT103", "모임 상위 5개 목록 조회 성공", result));
    }

    @GetMapping("/{meetingId}/info")
    public ResponseEntity<?> meetingDetails(@PathVariable Long meetingId) {
        FindMeetingResponse result = findMeetingService.findMeeting(meetingId);
        return ResponseEntity.ok(new ApiResponse<>("MT104", "모임 상세 정보 조회 성공", result));
    }

    @GetMapping("/{meetingId}/hashtag")
    public ResponseEntity<?> hashtagList(@PathVariable Long meetingId) {
        List<String> result = findHashtagService.findHashTag(meetingId);
        return ResponseEntity.ok(new ApiResponse<>("MT105", "모임 해시태그 조회 성공", result));
    }

    @DeleteMapping("/{meetingId}")
    public ResponseEntity<?> meetingLeave(@PathVariable Long meetingId,
                                          @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        leaveMeetingService.leaveMeeting(new LeaveMeetingDto(meetingId, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("MT106", "모임 나가기 성공", null));
    }

}
