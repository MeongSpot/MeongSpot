package com.ottogi.be.chat.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.chat.dto.FindChatRoomDto;
import com.ottogi.be.chat.dto.LeaveFriendChatRoomDto;
import com.ottogi.be.chat.dto.request.CreateFriendChatRoomRequest;
import com.ottogi.be.chat.dto.response.FindChatRoomResponse;
import com.ottogi.be.chat.dto.response.FriendChatRoomResponse;
import com.ottogi.be.chat.service.FindChatRoomService;
import com.ottogi.be.chat.service.CreateChatRoomService;
import com.ottogi.be.chat.service.LeaveChatRoomService;
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

    @GetMapping("/rooms/friend")
    public ResponseEntity<?> friendChatRoomList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<FriendChatRoomResponse> result = findChatRoomService.findFriendChatRoomList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("CH100", "채팅 목록 조회 성공", result));
    }

    @PostMapping("/rooms/friend")
    public ResponseEntity<?> friendChatRoomAdd(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                               @RequestBody CreateFriendChatRoomRequest request) {
        Long roomId = createChatRoomService.addFriendChatRoom(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("CH101", "채팅방 개설 성공", roomId));
    }

    @DeleteMapping("/rooms/friend/{chatRoomId}")
    public ResponseEntity<?> friendChatRoomLeave(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                                 @PathVariable Long chatRoomId) {
        LeaveFriendChatRoomDto dto = LeaveFriendChatRoomDto.builder()
                .loginId(loginMemberInfo.getLoginId())
                .chatRoomId(chatRoomId)
                .build();
        leaveChatRoomService.leaveFriendChatRoom(dto);
        return ResponseEntity.ok(new ApiResponse<>("CH102", "채팅방 나가기 성공", null));
    }

    @GetMapping("/rooms/{chatRoomId}")
    public ResponseEntity<?> chatRoomDetails(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                             @PathVariable Long chatRoomId, @PageableDefault(size = 30) Pageable pageable) {
        FindChatRoomDto dto = FindChatRoomDto.builder()
                .loginId(loginMemberInfo.getLoginId())
                .chatRoomId(chatRoomId)
                .build();
        FindChatRoomResponse result = findChatRoomService.findChatRoom(dto, pageable);
        return ResponseEntity.ok(new ApiResponse<>("CH103", "채팅방 상세 조회 성공", result));
    }
}
