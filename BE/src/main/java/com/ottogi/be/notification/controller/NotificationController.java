package com.ottogi.be.notification.controller;

import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.common.dto.response.ApiResponse;
import com.ottogi.be.notification.dto.NotificationDto;
import com.ottogi.be.notification.dto.request.FCMTokenRequest;
import com.ottogi.be.notification.dto.request.FriendInviteNotificationRequest;
import com.ottogi.be.notification.dto.request.NotificationReadRequest;
import com.ottogi.be.notification.dto.response.NotificationResponse;
import com.ottogi.be.notification.service.FCMTokenService;
import com.ottogi.be.notification.service.NotificationService;
import com.ottogi.be.notification.service.RespondFriendInvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {
    private final FCMTokenService fcmTokenService;
    private final NotificationService notificationService;
    private final RespondFriendInvitationService respondFriendInvitationService;

    @PostMapping("/fcm")
    public ResponseEntity<?> fcmTokenSave(@RequestBody FCMTokenRequest fcmTokenRequest,
                                          @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        fcmTokenService.saveFcmToken(fcmTokenRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO104", "FCMToken 저장 성공",null));

    }

    @GetMapping
    public ResponseEntity<?> notificationListFind(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<NotificationResponse> notifications = notificationService.findNotificationList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("NO102", "알림 목록 조회 성공", notifications));
    }

    @PatchMapping("/read")
    public ResponseEntity<?> notificationRead(@RequestBody NotificationReadRequest request,
                                              @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        notificationService.readNotification(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO100","알림 읽기 성공",null));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> notificationRemove(@PathVariable Long notificationId,
                                                @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        notificationService.removeNotification(NotificationDto.of(notificationId,loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO101","알림 삭제 성공",null));
    }

    @GetMapping("/read")
    public ResponseEntity<?> unReadNotificationCheck(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        Boolean result = notificationService.checkUnreadNotification(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("NO103", "읽지 않은 알림 조회 성공", result));
    }
    @PostMapping("/invitation/response")
    public ResponseEntity<?> friendInvitationRespond(@RequestBody FriendInviteNotificationRequest request,
                                                   @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        respondFriendInvitationService.respondFriendInvitation(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO100","그룹 초대 응답 성공",null));
    }



}
