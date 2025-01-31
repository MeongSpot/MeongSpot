package com.ottogi.be.member.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.member.dto.MemberDetailsDto;
import com.ottogi.be.member.dto.SearchMemberDto;
import com.ottogi.be.member.dto.request.ModifyNicknameRequest;
import com.ottogi.be.member.dto.request.ModifyProfileImageRequest;
import com.ottogi.be.member.dto.request.SignupRequest;
import com.ottogi.be.member.dto.response.FindMeetingMemberResponse;
import com.ottogi.be.member.dto.response.MemberDetailsResponse;
import com.ottogi.be.member.dto.response.ProfileInfoResponse;
import com.ottogi.be.member.dto.response.SearchMemberResponse;
import com.ottogi.be.member.service.*;
import com.ottogi.be.member.validation.annotation.LoginId;
import com.ottogi.be.member.validation.annotation.Nickname;
import com.ottogi.be.member.validation.annotation.Phone;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final SignupService signupService;
    private final CheckInfoService checkInfoService;
    private final FindMemberInfoService findMemberInfoService;
    private final ModifyProfileImageService modifyProfileImageService;
    private final ModifyNicknameService modifyNicknameService;
    private final FindMeetingMemberService findMeetingMemberService;
    private final SearchMemberService searchMemberService;

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

    @GetMapping("/profile-info")
    public ResponseEntity<?> profileInfoGet(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        ProfileInfoResponse result = findMemberInfoService.getProfileInfo(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("ME104", "프로필 정보 조회 성공", result));
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<?> memberDetails(@PathVariable Long memberId,
                                           @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        MemberDetailsResponse result = findMemberInfoService.findMemberDetails(new MemberDetailsDto(memberId, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME105", "사용자 정보 상세 조회 성공", result));
    }

    @PatchMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    ResponseEntity<?> profileImageModify(@ModelAttribute ModifyProfileImageRequest request,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws URISyntaxException, IOException {
        modifyProfileImageService.modifyProfileImage(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME106", "프로필 이미지 변경 성공", null));
    }

    @PatchMapping("/nickname")
    ResponseEntity<?> nicknameModify(@Valid @RequestBody ModifyNicknameRequest request,
                                     @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {

        modifyNicknameService.modifyNickname(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME107", "닉네임 변경 성공", null));
    }

    @GetMapping("/meeting/{meetingId}")
    ResponseEntity<?> meetingMemberList(@PathVariable Long meetingId) {
        List<FindMeetingMemberResponse> result = findMeetingMemberService.findMeetingMemberList(meetingId);
        return ResponseEntity.ok(new ApiResponse<>("ME108", "모임 참여 멤버 조회 성공", result));
    }

    @GetMapping("/search")
    public ResponseEntity<?> memberSearch(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                          @RequestParam String nickname) {
        List<SearchMemberResponse> result = searchMemberService.searchMember(new SearchMemberDto(loginMemberInfo.getLoginId(), nickname));
        return ResponseEntity.ok(new ApiResponse<>("ME109", "사용자 검색 성공", result));
    }

}
