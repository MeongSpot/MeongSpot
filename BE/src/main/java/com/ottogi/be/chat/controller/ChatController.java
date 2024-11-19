package com.ottogi.be.chat.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.chat.dto.FindChatRoomDto;
import com.ottogi.be.chat.dto.LeavePersonalChatRoomDto;
import com.ottogi.be.chat.dto.ReadMessageDto;
import com.ottogi.be.chat.dto.request.CreatePersonalChatRoomRequest;
import com.ottogi.be.chat.dto.response.FindChatRoomResponse;
import com.ottogi.be.chat.dto.response.ChatRoomResponse;
import com.ottogi.be.chat.service.FindChatRoomService;
import com.ottogi.be.chat.service.CreateChatRoomService;
import com.ottogi.be.chat.service.LeaveChatRoomService;
import com.ottogi.be.chat.service.ReadChatMessageService;
import com.ottogi.be.common.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final FindChatRoomService findChatRoomService;
    private final CreateChatRoomService createChatRoomService;
    private final LeaveChatRoomService leaveChatRoomService;
    private final ReadChatMessageService readChatMessageService;

    @GetMapping("/rooms")
    public ResponseEntity<?> personalChatRoomList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<ChatRoomResponse> result = findChatRoomService.findChatRoomList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("CH100", "채팅 목록 조회 성공", result));
    }

    @PostMapping("/rooms")
    public ResponseEntity<?> personalChatRoomAdd(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                               @RequestBody CreatePersonalChatRoomRequest request) {
        Long roomId = createChatRoomService.addPersonalChatRoom(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("CH101", "채팅방 개설 성공", roomId));
    }

    @DeleteMapping("/rooms/{chatRoomId}")
    public ResponseEntity<?> personalChatRoomLeave(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                                 @PathVariable Long chatRoomId) {
        LeavePersonalChatRoomDto dto = LeavePersonalChatRoomDto.builder()
                .loginId(loginMemberInfo.getLoginId())
                .chatRoomId(chatRoomId)
                .build();
        leaveChatRoomService.leavePersonalChatRoom(dto);
        return ResponseEntity.ok(new ApiResponse<>("CH102", "채팅방 나가기 성공", null));
    }

    @GetMapping("/rooms/{chatRoomId}")
    public ResponseEntity<?> chatRoomDetails(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                             @PathVariable Long chatRoomId, @PageableDefault(size = 100) Pageable pageable) {
        FindChatRoomDto dto = FindChatRoomDto.builder()
                .loginId(loginMemberInfo.getLoginId())
                .chatRoomId(chatRoomId)
                .build();
        FindChatRoomResponse result = findChatRoomService.findChatRoom(dto, pageable);
        return ResponseEntity.ok(new ApiResponse<>("CH103", "채팅방 상세 조회 성공", result));
    }

    @PatchMapping("/message-read")
    public ResponseEntity<?> chatMessageRead(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                             @RequestParam Long chatRoomId) {
        readChatMessageService.readChatMessage(new ReadMessageDto(loginMemberInfo.getLoginId(), chatRoomId));
        return ResponseEntity.ok(new ApiResponse<>("CH104", "채팅 메시지 읽기 성공", null));
    }
}
