package com.ottogi.be.meeting.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.meeting.dto.CreateMeetingDto;
import com.ottogi.be.meeting.dto.request.CreateMeetingRequest;
import com.ottogi.be.meeting.service.CreateMeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/meetings")
public class MeetingController {

    private final CreateMeetingService createMeetingService;

    @PostMapping("/{spotId}")
    public ResponseEntity<?> meetingAdd(@PathVariable Long spotId,
                                        @Valid @RequestBody CreateMeetingRequest createMeetingRequest,
                                        @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        createMeetingService.addMeeting(CreateMeetingDto.toDto(spotId, createMeetingRequest, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("MT100", "모임 생성 성공", null));
    }

}
