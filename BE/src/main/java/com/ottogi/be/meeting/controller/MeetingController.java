package com.ottogi.be.meeting.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.meeting.dto.CreateMeetingDto;
import com.ottogi.be.meeting.dto.JoinMeetingDto;
import com.ottogi.be.meeting.dto.MeetingDto;
import com.ottogi.be.meeting.dto.request.CreateMeetingRequest;
import com.ottogi.be.meeting.dto.request.JoinMeetingRequest;
import com.ottogi.be.meeting.dto.response.MeetingResponse;
import com.ottogi.be.meeting.dto.response.MeetingTopResponse;
import com.ottogi.be.meeting.service.CreateMeetingService;
import com.ottogi.be.meeting.service.FindMeetingService;
import com.ottogi.be.meeting.service.JoinMeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/meetings")
public class MeetingController {

    private final CreateMeetingService createMeetingService;
    private final JoinMeetingService joinMeetingService;
    private final FindMeetingService findMeetingService;

    @PostMapping()
    public ResponseEntity<?> meetingAdd(@Valid @RequestBody CreateMeetingRequest createMeetingRequest,
                                        @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        createMeetingService.addMeeting(CreateMeetingDto.toDto(createMeetingRequest, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("MT100", "모임 생성 성공", null));
    }

    @PostMapping("/{meetingId}")
    public ResponseEntity<?> meetingJoin(@PathVariable Long meetingId,
                                         @Valid @RequestBody JoinMeetingRequest joinMeetingRequest,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        joinMeetingService.joinMeeting(JoinMeetingDto.toDto(meetingId, joinMeetingRequest, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("MT101", "모임 참여 성공", null));
    }

    @GetMapping()
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

}
