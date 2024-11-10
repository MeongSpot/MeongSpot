package com.ottogi.be.friend.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.friend.dto.SearchFriendDto;
import com.ottogi.be.friend.dto.request.FriendInvitationRequest;
import com.ottogi.be.friend.dto.response.FriendResponse;
import com.ottogi.be.friend.service.FindFriendService;
import com.ottogi.be.friend.service.InviteFriendService;
import com.ottogi.be.notification.dto.request.FCMTokenRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendController {

    private final FindFriendService findFriendService;
    private final InviteFriendService inviteFriendService;

    @GetMapping
    public ResponseEntity<?> friendList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<FriendResponse> result = findFriendService.findFriendList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("FR100", "친구 목록 조회 성공", result));
    }

    @GetMapping("/search")
    public ResponseEntity<?> friendSearch(@RequestParam String keyword,
                                          @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<FriendResponse> result = findFriendService.findFriend(new SearchFriendDto(keyword, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("FR102", "친구 검색 성공", result));
    }

    @PostMapping("/invitation")
    public ResponseEntity<?> friendInvitation(@RequestBody FriendInvitationRequest request,
                                            @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws ExecutionException, InterruptedException {
        inviteFriendService.inviteFriend(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("FR101", "친구 초대 성공", null));

    }

}