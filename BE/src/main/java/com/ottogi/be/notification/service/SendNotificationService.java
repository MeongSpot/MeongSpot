package com.ottogi.be.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.concurrent.ExecutionException;

import static com.google.firebase.messaging.Notification.builder;

@Service
@Slf4j
@RequiredArgsConstructor
public class SendNotificationService {

    public void sendNotification(String targetToken, String title, String body) throws ExecutionException, InterruptedException {
        log.info("Preparing to send notification. Title: {}, Body: {}, Target Token: {}", title, body, targetToken);  // 메세지 로그
        Message message = Message.builder()
                .setToken(targetToken)
                .setNotification(builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();
        try {
            String response = FirebaseMessaging.getInstance().sendAsync(message).get();
            log.info("Successfully sent message: {}", response);
        } catch (ExecutionException e) {
            log.error("Failed to send message: {}", e.getMessage());
            throw e;
        } catch (InterruptedException e) {
            log.error("Notification sending was interrupted: {}", e.getMessage());
            throw e;
        }
    }
}
