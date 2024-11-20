package com.ottogi.be.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
@RequiredArgsConstructor
public class SendNotificationService {

    @Transactional
    public void sendNotification(String targetToken, String title, String body) {
        log.info("Preparing to send notification. Title: {}, Body: {}, Target Token: {}", title, body, targetToken);  // 메세지 로그
        Message message = Message.builder()
                .setToken(targetToken)
                .putData("title", title)
                .putData("body", body)
                .build();
        try {
            String response = FirebaseMessaging.getInstance().sendAsync(message).get();
            log.info("Successfully sent message: {}", response);
        } catch (ExecutionException e) {
            log.error("Failed to send message due to execution error: {}", e.getMessage());
        } catch (InterruptedException e) {
            log.error("Notification sending was interrupted: {}", e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
