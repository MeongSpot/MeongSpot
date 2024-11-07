package com.ottogi.be.friend.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.friend.dto.SearchFriendDto;
import com.ottogi.be.friend.dto.response.FriendResponse;
import com.ottogi.be.friend.service.FindFriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendController {

    private final FindFriendService findFriendService;

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

}
