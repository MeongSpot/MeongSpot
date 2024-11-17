import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter';
import { messaging } from './firebaseConfig';
import { onMessage } from 'firebase/messaging';

// 포그라운드 메시지 핸들러 설정
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
      if (messaging) {
        console.log("Firebase messaging initialized:", messaging);
        onMessage(messaging, (payload) => {
        console.log("Received foreground message:", payload);

    // 제목과 본문 데이터 추출
        const title = payload.notification?.title || payload.data?.title || "Default Title";
        const body = payload.notification?.body || payload.data?.body || "Default Body";

    // 브라우저 알림 생성
        if (Notification.permission === "granted") {
          console.log("Notification permission granted. Showing notification...");
          new Notification(title, {
            body: body,
            icon: "/icons/favicon/favicon-96x96.png", // 아이콘 경로
          // data: payload.data, // 추가 데이터 저장
          });
        } else {
          console.warn("Notification permission is not granted.");
        }
      });
    }
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
