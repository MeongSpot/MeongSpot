package com.ottogi.be.dog.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.dog.dto.MeetingDogDto;
import com.ottogi.be.dog.dto.request.DogAddRequest;
import com.ottogi.be.dog.dto.request.DogModifyRequest;
import com.ottogi.be.dog.dto.response.*;
import com.ottogi.be.dog.service.*;
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
@RequestMapping("/dogs")
public class DogController {

    private final BreedService breedService;
    private final PersonalityService personalityService;
    private final DogService dogService;
    private final FindDogService findDogService;
    private final FindMeetingDogService findMeetingDogService;

    @GetMapping("/breed")
    public ResponseEntity<?> breedList() {
        List<String> result = breedService.findBreedList();
        return ResponseEntity.ok(new ApiResponse<>("DO100", "견종 조회 성공", result));
    }

    @GetMapping("/breed/search")
    public ResponseEntity<?> breedSearch(@RequestParam String keyword) {
        List<String> result = breedService.findBreed(keyword);
        return ResponseEntity.ok(new ApiResponse<>("DO101", "견종 검색 성공", result));
    }

    @GetMapping("/personality")
    public ResponseEntity<?> personalityList() {
        List<PersonalityResponse> result = personalityService.findPersonalityList();
        return ResponseEntity.ok(new ApiResponse<>("DO102", "성격 조회 성공", result));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> dogAdd(@Valid @ModelAttribute DogAddRequest dogAddRequest,
                                    @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws IOException {
        dogService.addDog(dogAddRequest.toDto(loginMemberInfo.getLoginId()));
        return new ResponseEntity<>(new ApiResponse<>("DO103", "반려견 등록 성공", null), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> myDogList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<FindDogResponse> result = findDogService.findMyDogList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("DO104", "내 반려견 목록 조회 성공", result));
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<?> memberDogList(@PathVariable Long memberId) {
        List<FindDogResponse> result = findDogService.findMemberDogList(memberId);
        return ResponseEntity.ok(new ApiResponse<>("DO106", "사용자 반려견 목록 조회 성공", result));
    }

    @PutMapping("/{dogId}")
    public ResponseEntity<?> dogModify(@Valid @ModelAttribute DogModifyRequest dogModifyRequest,
                                       @PathVariable Long dogId,
                                       @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws URISyntaxException, IOException {
        dogService.modifyDog(dogModifyRequest.toDto(loginMemberInfo.getLoginId(), dogId));
        return ResponseEntity.ok(new ApiResponse<>("DO105", "반려견 정보 수정 성공", null));
    }

    @GetMapping("/name")
    public ResponseEntity<?> myDogNameList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<FindDogNameResponse> result = findDogService.findDogNameList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("DO107", "나의 반려견 이름 목록 조회 성공", result));
    }

    @GetMapping("/meeting/profileImage")
    public ResponseEntity<?> meetingDogProfileImageList(@RequestParam Long meetingId) {
        List<FindDogProfileImage> result = findMeetingDogService.findMeetingDogImageList(meetingId);
        return ResponseEntity.ok(new ApiResponse<>("DO108", "모임 참여 반려견 이미지 목록 조회 성공", result));
    }

    @GetMapping("/meeting")
    public ResponseEntity<?> meetingDogList(@RequestParam Long meetingId,
                                            @RequestParam Long memberId) {
        List<FindMeetingDogResponse> result = findMeetingDogService.findMeetingDogList(new MeetingDogDto(meetingId, memberId));
        return ResponseEntity.ok(new ApiResponse<>("DO109", "모임 참여 반려견 목록 조회 성공", result));
    }

    @GetMapping("/{dogId}/details")
    public ResponseEntity<?> dogDetails(@PathVariable Long dogId) {
        FindDogResponse result = findDogService.findDog(dogId);
        return ResponseEntity.ok(new ApiResponse<>("DO110", "반려견 상세 조회 성공", result));
    }

}
